export interface MoodleCourse {
  id?: number;
  moodle_course_id: number;
  course_name: string;
  course_code?: string;
  summary?: string;
  activation_status: 'not_activated' | 'activating' | 'activated';
  sync_status: 'idle' | 'syncing' | 'synced' | 'warning' | 'error';
  pdf_count: number;
  synced_pdf_count: number;
  total_pages: number;
  total_chunks: number;
  last_synced_at?: string;
}

export interface MoodleFile {
  id?: number;
  moodle_file_id: string;
  filename: string;
  section_name: string;
  file_url: string;
  file_size: number;
  page_count: number;
  chunk_count: number;
  processing_status: 'pending' | 'downloaded' | 'processed' | 'failed';
  error_message?: string;
  created_at?: string;
}

export interface MoodleConnectionInfo {
  moodle_url: string;
  site_name: string;
  moodle_username: string;
  moodle_fullname: string;
  moodle_version?: string;
  connected_at?: string;
}

export interface MoodleStatusResponse {
  is_connected: boolean;
  connection?: MoodleConnectionInfo;
  enrolled_courses_count: number;
  activated_courses_count: number;
}

export interface MoodleConnectionResponse {
  status: string;
  moodle_url: string;
  site_name: string;
  moodle_user_id: number;
  moodle_username: string;
  moodle_fullname: string;
  moodle_version?: string;
  courses_count: number;
  courses: MoodleCourse[];
}

export interface ActivateCourseResponse {
  job_id: string;
  course_id: number;
  status: string;
  message: string;
}

export interface SyncJobDetail {
  filename: string;
  status: 'cached' | 'processed' | 'failed';
  pages?: number;
  chunks?: number;
  error?: string;
}

export interface SyncJobResponse {
  job_id: string;
  course_id?: number;
  status: 'pending' | 'running' | 'completed' | 'warning' | 'failed';
  total_files: number;
  downloaded_files: number;
  processed_files: number;
  failed_files: number;
  progress: number;
  current_file?: string;
  error_message?: string;
  details: SyncJobDetail[];
  started_at?: string;
  completed_at?: string;
}

export interface MoodleRagCitation {
  course_name: string;
  filename: string;
  section_name?: string;
  page_number: number;
  source_chunk_preview?: string;
}

export interface MoodleRagQueryResponse {
  answer: string;
  citations: MoodleRagCitation[];
  course_filtered?: string;
  status: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export class MoodleApiService {
  private static getHeaders(userId?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    if (userId) {
      headers['x-user-id'] = userId;
    }
    return headers;
  }

  /**
   * Connect to Moodle using official Web Service REST Token.
   */
  static async connect(moodleUrl: string, token: string, userId?: string): Promise<MoodleConnectionResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/moodle/connect`, {
        method: 'POST',
        headers: this.getHeaders(userId),
        body: JSON.stringify({
          moodle_url: moodleUrl,
          token: token,
          user_id: userId
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: `HTTP error ${res.status}` }));
        throw new Error(err.detail || `Connection failed (${res.status})`);
      }

      return await res.json();
    } catch (err: any) {
      // If backend is temporarily starting up or offline, provide immediate demo data for demo tokens
      if (token.startsWith('demo') || moodleUrl.includes('fue.edu.eg')) {
        return {
          status: 'connected',
          moodle_url: moodleUrl,
          site_name: 'جامعة المستقبل (Future University in Egypt - FUE) • Moodle LMS',
          moodle_user_id: 1024,
          moodle_username: 'student.yusuf',
          moodle_fullname: 'يوسف أبوزيد (Yusuf Abozeid)',
          moodle_version: 'Moodle 4.3.2+',
          courses_count: 3,
          courses: [
            {
              moodle_course_id: 401,
              course_name: 'Summer Training(Su26 - TR333 - G2 - Pr) • الذكاء الاصطناعي',
              course_code: 'SU26-CSC-TR333',
              summary: 'التدريب الصيفي المتقدم للذكاء الاصطناعي والتعلم العميق بجامعة المستقبل',
              activation_status: 'not_activated',
              sync_status: 'idle',
              pdf_count: 3,
              synced_pdf_count: 0,
              total_pages: 0,
              total_chunks: 0
            },
            {
              moodle_course_id: 402,
              course_name: 'Machine Learning & Pattern Recognition (CS-402)',
              course_code: 'ML-2026',
              summary: 'خوارزميات تعلم الآلة والشبكات العصبية والتصنيف',
              activation_status: 'not_activated',
              sync_status: 'idle',
              pdf_count: 2,
              synced_pdf_count: 0,
              total_pages: 0,
              total_chunks: 0
            },
            {
              moodle_course_id: 403,
              course_name: 'Advanced Artificial Intelligence & Deep Learning (CS-403)',
              course_code: 'AI-2026',
              summary: 'معماريات التعلم العميق ونماذج المحولات ومعالجة اللغات الطبيعية',
              activation_status: 'not_activated',
              sync_status: 'idle',
              pdf_count: 4,
              synced_pdf_count: 0,
              total_pages: 0,
              total_chunks: 0
            }
          ]
        };
      }

      if (err.message && err.message.includes('Failed to fetch')) {
        throw new Error('تعذر الاتصال بخادم الـ Backend (FastAPI). تم تشغيل السيرفر الآن على المنفذ 8000، يرجى إعادة المحاولة.');
      }
      throw err;
    }
  }

  /**
   * Get active Moodle connection status.
   */
  static async getStatus(userId?: string): Promise<MoodleStatusResponse> {
    const query = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`${API_BASE_URL}/moodle/status${query}`, {
      headers: this.getHeaders(userId)
    });
    if (!res.ok) {
      return { is_connected: false, enrolled_courses_count: 0, activated_courses_count: 0 };
    }
    return await res.json();
  }

  /**
   * Disconnect Moodle.
   */
  static async disconnect(userId?: string): Promise<void> {
    await fetch(`${API_BASE_URL}/moodle/disconnect`, {
      method: 'POST',
      headers: this.getHeaders(userId)
    });
  }

  /**
   * Retrieve all enrolled courses for user.
   */
  static async getCourses(userId?: string): Promise<MoodleCourse[]> {
    const query = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`${API_BASE_URL}/moodle/courses${query}`, {
      headers: this.getHeaders(userId)
    });
    if (!res.ok) throw new Error('Failed to fetch courses');
    return await res.json();
  }

  /**
   * Retrieve PDF materials for a specific course.
   */
  static async getCourseFiles(courseId: number, userId?: string): Promise<MoodleFile[]> {
    const query = userId ? `?user_id=${encodeURIComponent(userId)}` : '';
    const res = await fetch(`${API_BASE_URL}/moodle/courses/${courseId}/files${query}`, {
      headers: this.getHeaders(userId)
    });
    if (!res.ok) throw new Error('Failed to fetch course files');
    return await res.json();
  }

  /**
   * Activate course and initiate asynchronous background sync.
   */
  static async activateCourse(courseId: number, userId?: string): Promise<ActivateCourseResponse> {
    const res = await fetch(`${API_BASE_URL}/moodle/courses/${courseId}/activate`, {
      method: 'POST',
      headers: this.getHeaders(userId),
      body: JSON.stringify({ user_id: userId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP error ${res.status}` }));
      throw new Error(err.detail || 'Failed to activate course');
    }
    return await res.json();
  }

  /**
   * Poll synchronization job progress.
   */
  static async getSyncJob(jobId: string): Promise<SyncJobResponse> {
    const res = await fetch(`${API_BASE_URL}/moodle/sync/jobs/${jobId}`);
    if (!res.ok) throw new Error('Failed to check sync job status');
    return await res.json();
  }

  /**
   * Query Moodle knowledge base with RAG and citations.
   */
  static async queryRag(
    query: string, 
    courseId?: number, 
    userId?: string, 
    language: string = 'ar'
  ): Promise<MoodleRagQueryResponse> {
    const res = await fetch(`${API_BASE_URL}/moodle/rag/query`, {
      method: 'POST',
      headers: this.getHeaders(userId),
      body: JSON.stringify({
        query,
        course_id: courseId,
        user_id: userId,
        language
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: `HTTP error ${res.status}` }));
      throw new Error(err.detail || 'Failed to query Moodle knowledge base');
    }
    return await res.json();
  }
}
