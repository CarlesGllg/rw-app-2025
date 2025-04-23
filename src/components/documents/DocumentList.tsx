import { useEffect, useState } from "react";
import DocumentCard from "./DocumentCard";
import { supabase } from "@/lib/supabase";

// Tipos de documento y categoría
type SupabaseDocument = {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "doc" | "xls" | "img" | "other";
  url: string;
  date: string;
  category: string;
  student_name?: string;
  is_global: boolean;
};

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
  const [documents, setDocuments] = useState<SupabaseDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("documents")
        .select(`
          id,
          title,
          description,
          category:document_categories(name),
          file_type,
          file_url,
          created_at,
          is_global,
          student:students(
            first_name,
            last_name1,
            last_name2
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        setError("Error al cargar los documentos.");
        setLoading(false);
        return;
      }

      // Adaptar al tipo esperado
      const parsedDocs: SupabaseDocument[] = (data ?? []).map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        description: doc.description ?? "",
        type: mapFileType(doc.file_type),
        url: doc.file_url,
        date: doc.created_at,
        category: doc.category?.name ?? "Sin categoría",
        is_global: doc.is_global,
        student_name: doc.student ? 
          `${doc.student.first_name} ${doc.student.last_name1}${doc.student.last_name2 ? ` ${doc.student.last_name2}` : ''}` 
          : undefined
      }));

      setDocuments(parsedDocs);

      // Obtener categorías únicas
      const uniqueCategories = [
        ...new Set(parsedDocs.map((doc) => doc.category))
      ];
      setCategories(uniqueCategories);

      setLoading(false);
    };

    fetchDocuments();
  }, []);

  // Mapear tipos de archivo
  function mapFileType(type: string): SupabaseDocument["type"] {
    if (type === "pdf") return "pdf";
    if (type === "doc" || type === "docx") return "doc";
    if (type === "xls" || type === "xlsx") return "xls";
    if (type === "jpg" || type === "jpeg" || type === "png") return "img";
    return "other";
  }

  const filteredDocuments = activeCategory
    ? documents.filter((doc) => doc.category === activeCategory)
    : documents;

  // Loading and error UI
  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500 animate-pulse">
        Cargando documentos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">
        {error}
      </div>
    );
  }

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
