
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle, X } from "lucide-react";
import { parseExcelRoster, ParsedRosterData } from "@/utils/excelParser";
import { RosterAssignment } from "@/pages/EmployeeRoster";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface RosterUploadProps {
  onRosterImport: (assignments: RosterAssignment[]) => void;
  existingAssignments: RosterAssignment[];
}

export const RosterUpload = ({ onRosterImport, existingAssignments }: RosterUploadProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedRosterData | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setParsedData(null);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setSelectedFile(file);
      setParsedData(null);
    }
  };

  const parseFile = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      const result = await parseExcelRoster(selectedFile);
      setParsedData(result);
      
      if (result.errors.length > 0) {
        toast({
          title: "Parse Errors",
          description: `Found ${result.errors.length} errors in the Excel file`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "File Parsed Successfully",
          description: `Found ${result.assignments.length} roster assignments`,
        });
      }
    } catch (error) {
      toast({
        title: "Parse Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImport = () => {
    if (!parsedData || parsedData.errors.length > 0) return;
    
    // Filter out assignments for unmatched employees
    const validAssignments = parsedData.assignments.filter(assignment => 
      parsedData.employees.some(emp => emp.matchedId === assignment.employeeId)
    );
    
    onRosterImport(validAssignments);
    
    toast({
      title: "Roster Imported",
      description: `Successfully imported ${validAssignments.length} roster assignments`,
    });
    
    setIsOpen(false);
    setSelectedFile(null);
    setParsedData(null);
  };

  const getExistingAssignmentsCount = () => {
    if (!parsedData) return 0;
    
    return parsedData.assignments.filter(newAssignment =>
      existingAssignments.some(existing =>
        existing.employeeId === newAssignment.employeeId &&
        existing.date === newAssignment.date
      )
    ).length;
  };

  const reset = () => {
    setSelectedFile(null);
    setParsedData(null);
    setIsUploading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload Roster
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Employee Roster</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* File Upload Area */}
          {!selectedFile && (
            <Card>
              <CardContent className="p-6">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Upload Excel Roster File
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Drag and drop your Excel file here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="roster-file-input"
                  />
                  <label htmlFor="roster-file-input">
                    <Button type="button" variant="outline" asChild>
                      <span className="cursor-pointer">Choose File</span>
                    </Button>
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* File Selected */}
          {selectedFile && !parsedData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Selected File</span>
                  <Button variant="ghost" size="sm" onClick={reset}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Button onClick={parseFile} disabled={isUploading}>
                    {isUploading ? "Parsing..." : "Parse File"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Parse Results */}
          {parsedData && (
            <>
              {/* Errors */}
              {parsedData.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Errors found:</p>
                      {parsedData.errors.map((error, index) => (
                        <p key={index} className="text-sm">• {error}</p>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Warnings */}
              {parsedData.warnings.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Warnings:</p>
                      {parsedData.warnings.slice(0, 5).map((warning, index) => (
                        <p key={index} className="text-sm">• {warning}</p>
                      ))}
                      {parsedData.warnings.length > 5 && (
                        <p className="text-sm text-gray-500">
                          ... and {parsedData.warnings.length - 5} more warnings
                        </p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Employee Matching */}
              {parsedData.employees.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Employee Matching</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {parsedData.employees.map((emp, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b">
                          <span className="font-medium">{emp.originalName}</span>
                          <div className="flex items-center space-x-2">
                            {emp.matchedId ? (
                              <>
                                <span className="text-sm text-gray-600">→ {emp.matchedName}</span>
                                <Badge variant={emp.confidence >= 0.8 ? "default" : "secondary"}>
                                  {Math.round(emp.confidence * 100)}%
                                </Badge>
                              </>
                            ) : (
                              <Badge variant="destructive">No Match</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Import Summary */}
              {parsedData.errors.length === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Import Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {parsedData.assignments.length}
                        </div>
                        <div className="text-sm text-gray-500">Total Assignments</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {getExistingAssignmentsCount()}
                        </div>
                        <div className="text-sm text-gray-500">Will Update</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {parsedData.assignments.length - getExistingAssignmentsCount()}
                        </div>
                        <div className="text-sm text-gray-500">New Assignments</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={reset}>
                  Start Over
                </Button>
                {parsedData.errors.length === 0 && (
                  <Button onClick={handleImport} className="ml-auto">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Import Roster
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
