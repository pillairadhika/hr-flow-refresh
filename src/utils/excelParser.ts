
import * as XLSX from 'xlsx';
import { RosterAssignment, ShiftType } from '@/pages/EmployeeRoster';
import { format, parse, isValid } from 'date-fns';

export interface ParsedEmployee {
  originalName: string;
  matchedId?: string;
  matchedName?: string;
  confidence: number;
}

export interface ParsedRosterData {
  employees: ParsedEmployee[];
  assignments: RosterAssignment[];
  errors: string[];
  warnings: string[];
}

const mockEmployees = [
  { id: "1", name: "John Smith", department: "Kitchen", designation: "Chef" },
  { id: "2", name: "Sarah Johnson", department: "Service", designation: "Waitress" },
  { id: "3", name: "Mike Wilson", department: "Kitchen", designation: "Cook" },
  { id: "4", name: "Emily Brown", department: "Service", designation: "Cashier" },
  { id: "5", name: "David Lee", department: "Management", designation: "Supervisor" },
  { id: "6", name: "Lisa Garcia", department: "Service", designation: "Waitress" },
];

const validShiftCodes: (ShiftType | "OFF")[] = ["AM", "PM", "MID", "STRAIGHT", "OFF"];

// Simple fuzzy matching for employee names
const calculateSimilarity = (str1: string, str2: string): number => {
  const a = str1.toLowerCase().trim();
  const b = str2.toLowerCase().trim();
  
  if (a === b) return 1;
  
  // Check if one name contains the other
  if (a.includes(b) || b.includes(a)) return 0.8;
  
  // Simple Levenshtein distance approximation
  const maxLength = Math.max(a.length, b.length);
  const distance = levenshteinDistance(a, b);
  return 1 - (distance / maxLength);
};

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

const matchEmployees = (excelEmployeeNames: string[]): ParsedEmployee[] => {
  return excelEmployeeNames.map(excelName => {
    let bestMatch: ParsedEmployee = {
      originalName: excelName,
      confidence: 0
    };
    
    mockEmployees.forEach(emp => {
      const similarity = calculateSimilarity(excelName, emp.name);
      if (similarity > bestMatch.confidence) {
        bestMatch = {
          originalName: excelName,
          matchedId: emp.id,
          matchedName: emp.name,
          confidence: similarity
        };
      }
    });
    
    return bestMatch;
  });
};

const parseDate = (dateValue: any): Date | null => {
  if (!dateValue) return null;
  
  // Handle Excel serial date numbers
  if (typeof dateValue === 'number') {
    const date = XLSX.SSF.parse_date_code(dateValue);
    return new Date(date.y, date.m - 1, date.d);
  }
  
  // Handle string dates
  if (typeof dateValue === 'string') {
    // Try common date formats
    const formats = ['yyyy-MM-dd', 'MM/dd/yyyy', 'dd/MM/yyyy', 'M/d/yyyy'];
    
    for (const formatStr of formats) {
      try {
        const parsed = parse(dateValue, formatStr, new Date());
        if (isValid(parsed)) return parsed;
      } catch (e) {
        // Continue to next format
      }
    }
  }
  
  return null;
};

const normalizeShiftCode = (value: any): ShiftType | "OFF" | null => {
  if (!value) return "OFF";
  
  const str = String(value).trim().toUpperCase();
  
  if (validShiftCodes.includes(str as ShiftType | "OFF")) {
    return str as ShiftType | "OFF";
  }
  
  // Handle common variations
  const variations: Record<string, ShiftType | "OFF"> = {
    'MORNING': 'AM',
    'EVENING': 'PM',
    'NIGHT': 'MID',
    'MIDNIGHT': 'MID',
    'FULL': 'STRAIGHT',
    'FULLDAY': 'STRAIGHT',
    'REST': 'OFF',
    'LEAVE': 'OFF',
    '-': 'OFF',
    '': 'OFF'
  };
  
  return variations[str] || null;
};

export const parseExcelRoster = (file: File): Promise<ParsedRosterData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        const result: ParsedRosterData = {
          employees: [],
          assignments: [],
          errors: [],
          warnings: []
        };
        
        if (!jsonData || jsonData.length < 2) {
          result.errors.push('Excel file appears to be empty or invalid');
          resolve(result);
          return;
        }
        
        // Find header row (should contain employee names)
        let headerRowIndex = -1;
        let dateColumnIndex = -1;
        
        for (let i = 0; i < Math.min(5, jsonData.length); i++) {
          const row = jsonData[i] as any[];
          if (row && row.length > 2) {
            // Look for a date-like column and employee names
            for (let j = 0; j < row.length; j++) {
              if (row[j] && typeof row[j] === 'string' && 
                  (row[j].toLowerCase().includes('date') || row[j].toLowerCase().includes('day'))) {
                headerRowIndex = i;
                dateColumnIndex = j;
                break;
              }
            }
            if (headerRowIndex >= 0) break;
          }
        }
        
        if (headerRowIndex === -1 || dateColumnIndex === -1) {
          result.errors.push('Could not find header row with date column and employee names');
          resolve(result);
          return;
        }
        
        // Extract employee names from header
        const headerRow = jsonData[headerRowIndex] as any[];
        const employeeNames: string[] = [];
        const employeeColumnMap: Record<number, string> = {};
        
        for (let i = dateColumnIndex + 1; i < headerRow.length; i++) {
          if (headerRow[i] && typeof headerRow[i] === 'string' && headerRow[i].trim()) {
            const employeeName = headerRow[i].trim();
            employeeNames.push(employeeName);
            employeeColumnMap[i] = employeeName;
          }
        }
        
        if (employeeNames.length === 0) {
          result.errors.push('No employee names found in header row');
          resolve(result);
          return;
        }
        
        // Match employees
        result.employees = matchEmployees(employeeNames);
        
        // Parse roster data
        for (let rowIndex = headerRowIndex + 1; rowIndex < jsonData.length; rowIndex++) {
          const row = jsonData[rowIndex] as any[];
          if (!row || row.length <= dateColumnIndex) continue;
          
          const dateValue = row[dateColumnIndex];
          const parsedDate = parseDate(dateValue);
          
          if (!parsedDate) {
            if (dateValue && String(dateValue).trim()) {
              // Skip summary rows or empty rows
              continue;
            }
            continue;
          }
          
          const dateString = format(parsedDate, 'yyyy-MM-dd');
          
          // Process each employee column
          for (let colIndex = dateColumnIndex + 1; colIndex < row.length; colIndex++) {
            const employeeName = employeeColumnMap[colIndex];
            if (!employeeName) continue;
            
            const employeeMatch = result.employees.find(emp => emp.originalName === employeeName);
            if (!employeeMatch || !employeeMatch.matchedId) continue;
            
            const shiftValue = row[colIndex];
            const normalizedShift = normalizeShiftCode(shiftValue);
            
            if (normalizedShift === null && shiftValue && String(shiftValue).trim()) {
              result.warnings.push(`Unknown shift code "${shiftValue}" for ${employeeName} on ${dateString}`);
              continue;
            }
            
            const assignment: RosterAssignment = {
              employeeId: employeeMatch.matchedId,
              date: dateString,
              isOffDay: normalizedShift === "OFF",
              shiftId: normalizedShift !== "OFF" ? 
                (normalizedShift === "AM" ? "1" : 
                 normalizedShift === "PM" ? "2" : 
                 normalizedShift === "MID" ? "3" : 
                 normalizedShift === "STRAIGHT" ? "4" : undefined) : undefined
            };
            
            result.assignments.push(assignment);
          }
        }
        
        // Add warnings for low-confidence matches
        result.employees.forEach(emp => {
          if (emp.confidence < 0.8 && emp.matchedId) {
            result.warnings.push(`Low confidence match: "${emp.originalName}" → "${emp.matchedName}"`);
          } else if (!emp.matchedId) {
            result.warnings.push(`No match found for employee: "${emp.originalName}"`);
          }
        });
        
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsBinaryString(file);
  });
};
