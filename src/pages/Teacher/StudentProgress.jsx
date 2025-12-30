import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, User } from 'lucide-react';

// NOTE: This component uses MOCK DATA because the backend endpoint doesn't exist yet
// TODO: Create backend endpoint: GET /api/v1/students/{id}/progress
// Then update this component to use real API calls

export default function StudentProgress() {
  // Mock data - will be replaced with real API call
  const [students] = useState([
    {
      id: 1,
      name: 'John Kamau',
      email: 'john@student.com',
      averageGrade: 85,
      completionRate: 92,
      trend: 'up',
      subjects: [
        { name: 'Mathematics', grade: 88, completion: 95 },
        { name: 'Physics', grade: 82, completion: 90 },
      ],
    },
    {
      id: 2,
      name: 'Sarah Nakato',
      email: 'sarah@student.com',
      averageGrade: 78,
      completionRate: 85,
      trend: 'down',
      subjects: [
        { name: 'Mathematics', grade: 75, completion: 80 },
        { name: 'Physics', grade: 81, completion: 90 },
      ],
    },
    {
      id: 3,
      name: 'Peter Omondi',
      email: 'peter@student.com',
      averageGrade: 92,
      completionRate: 98,
      trend: 'up',
      subjects: [
        { name: 'Mathematics', grade: 94, completion: 100 },
        { name: 'Physics', grade: 90, completion: 96 },
      ],
    },
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Progress</h1>
        <p className="text-gray-600">Track student performance across subjects</p>
      </div>

      {/* Note about mock data */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This page currently shows mock data. 
          Real student progress tracking will be available once the backend endpoint is implemented.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Grade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completion Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-lg font-semibold ${getGradeColor(student.averageGrade)}`}>
                    {student.averageGrade}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2" style={{ width: '100px' }}>
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${student.completionRate}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{student.completionRate}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getTrendIcon(student.trend)}
                    <span className="ml-1 text-sm text-gray-600 capitalize">{student.trend}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h2>
                <p className="text-gray-600">{selectedStudent.email}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Average Grade</p>
                <p className={`text-2xl font-bold ${getGradeColor(selectedStudent.averageGrade)}`}>
                  {selectedStudent.averageGrade}%
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-indigo-600">{selectedStudent.completionRate}%</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Subject Performance</h3>
            <div className="space-y-3">
              {selectedStudent.subjects.map((subject, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{subject.name}</span>
                    <span className={`font-semibold ${getGradeColor(subject.grade)}`}>
                      {subject.grade}%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${subject.completion}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{subject.completion}% complete</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}