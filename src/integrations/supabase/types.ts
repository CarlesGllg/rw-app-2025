export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      allowed_emails: {
        Row: {
          email: string
          id: string
          suspended: boolean | null
        }
        Insert: {
          email: string
          id?: string
          suspended?: boolean | null
        }
        Update: {
          email?: string
          id?: string
          suspended?: boolean | null
        }
        Relationships: []
      }
      course_school: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          school_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          school_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_school_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_school_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          id: string
          name: string
          school_id: string | null
          teacher_id: string | null
        }
        Insert: {
          id?: string
          name: string
          school_id?: string | null
          teacher_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          school_id?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      document_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      document_student: {
        Row: {
          created_at: string | null
          document_id: string
          id: string
          is_global: boolean
          student_id: string
        }
        Insert: {
          created_at?: string | null
          document_id: string
          id?: string
          is_global?: boolean
          student_id: string
        }
        Update: {
          created_at?: string | null
          document_id?: string
          id?: string
          is_global?: boolean
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_student_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_student_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          file_type: string
          file_url: string
          id: string
          title: string
          updated_at: string
          uploader_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          file_type: string
          file_url: string
          id?: string
          title: string
          updated_at?: string
          uploader_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          file_type?: string
          file_url?: string
          id?: string
          title?: string
          updated_at?: string
          uploader_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "document_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      event_school: {
        Row: {
          created_at: string
          event_id: string
          id: string
          school_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          school_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_school_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_school_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          start_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          start_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          start_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      message_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          message_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          message_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          message_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_student: {
        Row: {
          created_at: string | null
          id: string
          message_id: string
          read: boolean | null
          student_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_id: string
          read?: boolean | null
          student_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message_id?: string
          read?: boolean | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_student_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_student_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          date: string | null
          id: string
          priority: string | null
          sender: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          id?: string
          priority?: string | null
          sender: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          id?: string
          priority?: string | null
          sender?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      student_course: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          student_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          student_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_course_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_course_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_parent: {
        Row: {
          parent_id: string
          student_id: string
        }
        Insert: {
          parent_id: string
          student_id: string
        }
        Update: {
          parent_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_parent_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          first_name: string
          id: string
          last_name1: string
          last_name2: string | null
        }
        Insert: {
          first_name: string
          id?: string
          last_name1: string
          last_name2?: string | null
        }
        Update: {
          first_name?: string
          id?: string
          last_name1?: string
          last_name2?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_messages_for_parent: {
        Args: { p_parent_id: string }
        Returns: {
          id: string
          title: string
          content: string
          date: string
          sender: string
          priority: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
