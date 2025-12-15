// Database types gegenereerd voor Supabase
// Run `npx supabase gen types typescript` om te updaten na schema wijzigingen

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string | null
          business_name: string
          domain: string | null
          email: string
          phone: string | null
          package: 'starter' | 'professional' | 'premium'
          status: 'pending' | 'onboarding' | 'design' | 'review' | 'revisions' | 'live' | 'cancelled'
          payment_status: 'unpaid' | 'awaiting_payment' | 'paid' | 'failed' | 'refunded'
          design_approved_at: string | null
          payment_url: string | null
          subscription_id: string | null
          live_url: string | null
          notes: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          business_name: string
          domain?: string | null
          email: string
          phone?: string | null
          package: 'starter' | 'professional' | 'premium'
          status?: 'pending' | 'onboarding' | 'design' | 'review' | 'revisions' | 'live' | 'cancelled'
          payment_status?: 'unpaid' | 'awaiting_payment' | 'paid' | 'failed' | 'refunded'
          design_approved_at?: string | null
          payment_url?: string | null
          subscription_id?: string | null
          live_url?: string | null
          notes?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string | null
          business_name?: string
          domain?: string | null
          email?: string
          phone?: string | null
          package?: 'starter' | 'professional' | 'premium'
          status?: 'pending' | 'onboarding' | 'design' | 'review' | 'revisions' | 'live' | 'cancelled'
          payment_status?: 'unpaid' | 'awaiting_payment' | 'paid' | 'failed' | 'refunded'
          design_approved_at?: string | null
          payment_url?: string | null
          subscription_id?: string | null
          live_url?: string | null
          notes?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'projects_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'customer' | 'developer' | 'admin' | 'marketing' | 'marketing'
          metadata: Json | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'developer' | 'admin' | 'marketing'
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'developer' | 'admin' | 'marketing'
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'users_id_fkey'
            columns: ['id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      invoices: {
        Row: {
          id: string
          created_at: string
          project_id: string
          user_id: string | null
          invoice_number: string
          amount: number
          vat_amount: number
          total_amount: number
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          due_date: string
          paid_at: string | null
          pdf_url: string | null
          mollie_payment_id: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          user_id?: string | null
          invoice_number: string
          amount: number
          vat_amount: number
          total_amount: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          due_date: string
          paid_at?: string | null
          pdf_url?: string | null
          mollie_payment_id?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          user_id?: string | null
          invoice_number?: string
          amount?: number
          vat_amount?: number
          total_amount?: number
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          due_date?: string
          paid_at?: string | null
          pdf_url?: string | null
          mollie_payment_id?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'invoices_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'invoices_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          created_at: string
          project_id: string
          user_id: string | null
          mollie_subscription_id: string | null
          mollie_customer_id: string | null
          status: 'pending' | 'active' | 'paused' | 'cancelled' | 'suspended'
          interval: 'monthly' | 'yearly'
          amount: number
          next_payment_date: string | null
          cancelled_at: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          user_id?: string | null
          mollie_subscription_id?: string | null
          mollie_customer_id?: string | null
          status?: 'pending' | 'active' | 'paused' | 'cancelled' | 'suspended'
          interval?: 'monthly' | 'yearly'
          amount: number
          next_payment_date?: string | null
          cancelled_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          user_id?: string | null
          mollie_subscription_id?: string | null
          mollie_customer_id?: string | null
          status?: 'pending' | 'active' | 'paused' | 'cancelled' | 'suspended'
          interval?: 'monthly' | 'yearly'
          amount?: number
          next_payment_date?: string | null
          cancelled_at?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'subscriptions_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      feedback: {
        Row: {
          id: string
          created_at: string
          project_id: string
          user_id: string | null
          type: 'text' | 'design' | 'bug' | 'feature'
          content: string
          status: 'new' | 'seen' | 'in_progress' | 'resolved'
          page: string | null
          element: string | null
          resolved_at: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          user_id?: string | null
          type?: 'text' | 'design' | 'bug' | 'feature'
          content: string
          status?: 'new' | 'seen' | 'in_progress' | 'resolved'
          page?: string | null
          element?: string | null
          resolved_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          user_id?: string | null
          type?: 'text' | 'design' | 'bug' | 'feature'
          content?: string
          status?: 'new' | 'seen' | 'in_progress' | 'resolved'
          page?: string | null
          element?: string | null
          resolved_at?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'feedback_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'feedback_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      chat_messages: {
        Row: {
          id: string
          created_at: string
          project_id: string
          user_id: string | null
          sender: 'customer' | 'developer'
          message: string
          read_at: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          user_id?: string | null
          sender: 'customer' | 'developer'
          message: string
          read_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          user_id?: string | null
          sender?: 'customer' | 'developer'
          message?: string
          read_at?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'chat_messages_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'chat_messages_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      files: {
        Row: {
          id: string
          created_at: string
          project_id: string
          user_id: string | null
          name: string
          url: string
          size: number
          type: string
          category: 'logo' | 'image' | 'document' | 'other'
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          user_id?: string | null
          name: string
          url: string
          size: number
          type: string
          category?: 'logo' | 'image' | 'document' | 'other'
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          user_id?: string | null
          name?: string
          url?: string
          size?: number
          type?: string
          category?: 'logo' | 'image' | 'document' | 'other'
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'files_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'files_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      project_status: 'pending' | 'onboarding' | 'design' | 'review' | 'revisions' | 'live' | 'cancelled'
      payment_status: 'unpaid' | 'awaiting_payment' | 'paid' | 'failed' | 'refunded'
      user_role: 'customer' | 'developer' | 'admin' | 'marketing'
      subscription_status: 'pending' | 'active' | 'paused' | 'cancelled' | 'suspended'
      subscription_interval: 'monthly' | 'yearly'
      feedback_type: 'text' | 'design' | 'bug' | 'feature'
      feedback_status: 'new' | 'seen' | 'in_progress' | 'resolved'
      file_category: 'logo' | 'image' | 'document' | 'other'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> = 
  Database['public']['Tables'][T]['Update']

// Convenience type exports
export type Project = Tables<'projects'>
export type User = Tables<'users'>
export type Invoice = Tables<'invoices'>
export type Subscription = Tables<'subscriptions'>
export type Feedback = Tables<'feedback'>
export type ChatMessage = Tables<'chat_messages'>
export type File = Tables<'files'>
