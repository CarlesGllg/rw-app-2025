import { useEffect, useState } from "react";
import DocumentCard from "./DocumentCard";
import { supabase } from "@/lib/supabase";

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
        className={`px-3 py-1 rounded-full text-sm ${activeCategory === null
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
          className={`px-3 py-1 rounded-full text-sm ${activeCategory === category
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
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchParentId = async () => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id")
        .maybeSingle();

      if (error) {
        console.error("Error al obtener el perfil:", error.message);
        return;
      }

      if (profile) {
        setParentId(profile.id);
      }
    };

    fetchParentId();
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!parentId) return;
      setLoading(true);
      setError(null);

      try {
        const { data: studentData, error: studentError } = await supabase
          .from("student_parent")
          .select("student_id")
          .eq("parent_id", parentId);

        if (studentError) throw new Error(studentError.message);

        const studentIds = studentData.map((row) => row.student_id);

        if (studentIds.length === 0) {
          setDocuments([]);
          setLoading(false);
          return;
        }

        const { data: docLinks, error: docLinkError } = await supabase
          .from("document_student")
          .select(`
            document_id,
            is_global,
            student_id,
            created_at,
            documents (
              id,
              title,
              description,
              file_type,
              file_url,
              category:document_categories(name)
            ),
            students (
              first_name,
              last_name1,
              last_name2
            )
          `)
          .or(`is_global.eq.true,student_id.in.(${studentIds.join(",")})`)
          .order("created_at", { ascending: false }); // Orden por fecha de vinculación

        if (docLinkError) throw new Error(docLinkError.message);

        const parsedDocs: SupabaseDocument[] = (docLinks ?? [])
          .filter((link) => link.documents)
          .map((link) => ({
            id: link.documents.id,
            title: link.documents.title,
            description: link.documents.description ?? "",
            type: mapFileType(link.documents.file_type),
            url: link.documents.file_url,
            date: link.created_at, // Fecha de vinculación
            category: link.documents.category?.name ?? "Sin categoría",
            is_global: link.is_global,
            student_name: link.is_global
              ? undefined
              : link.students
                ? `${link.students.first_name} ${link.students.last_name1}${link.students.last_name2 ? ` ${link.students.last_name2}` : ""}`
                : undefined
          }));

        setDocuments(parsedDocs);

        const uniqueCategories = [
          ...new Set(parsedDocs.map((doc) => doc.category))
        ];
        setCategories(uniqueCategories);
      } catch (err: any) {
        console.error("Error al cargar documentos:", err.message);
        setError("Error al cargar los documentos.");
      }

      setLoading(false);
    };

    fetchDocuments();
  }, [parentId]);

  const mapFileType = (type: string): SupabaseDocument["type"] => {
    if (type === "pdf") return "pdf";
    if (["doc", "docx"].includes(type)) return "doc";
    if (["xls", "xlsx"].includes(type)) return "xls";
    if (["jpg", "jpeg", "png"].includes(type)) return "img";
    return "other";
  };

  const filteredDocuments = activeCategory
    ? documents.filter((doc) => doc.category === activeCategory)
    : documents;

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
