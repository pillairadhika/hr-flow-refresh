
export const LeaveSection = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">YOUR APPROVED LEAVES</h2>
      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Leave Type</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={2} className="text-center py-8 text-gray-500">
                No records found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
