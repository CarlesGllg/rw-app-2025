
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

type Student = {
  id: string;
  first_name: string;
  last_name1: string;
};

type StudentListProps = {
  students: Student[];
};

const StudentList = ({ students = [] }: StudentListProps) => {
  const { t } = useTranslation();

  return (
    <div className="mt-6">
      <h3 className="font-medium text-gray-700 mb-3">{t('dashboard.students')}</h3>
      {students && students.length > 0 ? (
        <div className="space-y-2">
          {students.map((student) => (
            <div key={student.id} className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
              {student.first_name} {student.last_name1}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
          {t('dashboard.noStudents')}
        </div>
      )}
    </div>
  );
};

export default StudentList;
