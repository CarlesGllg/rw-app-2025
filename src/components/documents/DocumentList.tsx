
import { useState } from "react";
import DocumentCard from "./DocumentCard";

// Sample data for documents
const DOCUMENTS = [
  {
    id: "1",
    title: "Calendario Escolar 2025",
    description: "Calendario oficial con fechas importantes, periodos vacacionales y eventos escolares",
    type: "pdf",
    url: "#",
    date: "2025-04-01T10:00:00",
    category: "Administrativo"
  },
  {
    id: "2",
    title: "Reglamento Interno",
    description: "Normativa de convivencia escolar, derechos y obligaciones de la comunidad educativa",
    type: "pdf",
    url: "#",
    date: "2025-03-15T14:30:00",
    category: "Normativas"
  },
  {
    id: "3",
    title: "Lista de útiles - 4º Primaria",
    description: "Lista completa de materiales necesarios para el curso escolar",
    type: "pdf",
    url: "#",
    date: "2025-03-10T09:45:00",
    category: "Material Escolar"
  },
  {
    id: "4",
    title: "Circular - Excursión educativa",
    description: "Información sobre la visita al museo programada para el 5 de mayo",
    type: "doc",
    url: "#",
    date: "2025-04-12T13:20:00",
    category: "Actividades"
  },
  {
    id: "5",
    title: "Formulario de autorización médica",
    description: "Documento para autorización de medicamentos en horario escolar",
    type: "pdf",
    url: "#",
    date: "2025-02-28T11:10:00",
    category: "Salud"
  }
];

// Category filter component
const CategoryFilter = ({ 
  categories, 
  activeCategory,
  onChange
}: {
  categories: string[];
  activeCategory: string | null;
  onChange: (category: string | null) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => onChange(null)}
        className={`px-3 py-1 rounded-full text-sm ${
          activeCategory === null 
            ? "bg-ios-blue text-white" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Todos
      </button>
      
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`px-3 py-1 rounded-full text-sm ${
            activeCategory === category 
              ? "bg-ios-blue text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

const DocumentList = () => {
  const [documents, setDocuments] = useState(DOCUMENTS);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  const categories = [...new Set(documents.map(doc => doc.category))];
  
  const filteredDocuments = activeCategory 
    ? documents.filter(doc => doc.category === activeCategory)
    : documents;

  return (
    <div className="space-y-4">
      <CategoryFilter 
        categories={categories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />
      
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay documentos disponibles</p>
        </div>
      ) : (
        filteredDocuments.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))
      )}
    </div>
  );
};

export default DocumentList;
