// service/logbookService.ts

export interface LogbookData {
  id: number;
  magangId: number;
  tanggal: string;
  kegiatan: string;
  kendala_2: string;
  file: string;
  statusVerifikasi: 'pending' | 'approved' | 'rejected';
  catatanGuru?: string;
  catatanDudi?: string;
  createdAt: string;
  updatedAt: string;
  magang: {
    id: number;
    siswa: {
      id: number;
      nama: string;
      nis: string;
    };
    dudi: {
      id: number;
      namaPerusahaan: string;
    };
    guru: {
      id: number;
      nama: string;
    };
  };
}

export interface LogbookStats {
  totalLogbook: number;
  pendingLogbook: number;
  approvedLogbook: number;
  rejectedLogbook: number;
}

export interface CreateLogbookRequest {
  magangId: number;
  kegiatan: string;
  kendala_2?: string;
  file?: string;
}

export interface UpdateLogbookRequest {
  statusVerifikasi: 'approved' | 'rejected';
  catatanGuru?: string;
}

class LogbookService {
  private baseUrl = '/api/logbook';

  // Get logbooks with pagination and filters
  async getLogbooks(
    page: number = 1,
    limit: number = 10,
    status?: string,
    search?: string
  ): Promise<{
    success: boolean;
    data: LogbookData[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(search && { search })
      });

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        credentials: 'same-origin',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch logbooks');
      }

      return data;
    } catch (error) {
      console.error('Error fetching logbooks:', error);
      throw error;
    }
  }

  // Get specific logbook by ID
  async getLogbookById(id: number): Promise<{
    success: boolean;
    data: LogbookData;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'GET',
        credentials: 'same-origin',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch logbook');
      }

      return data;
    } catch (error) {
      console.error('Error fetching logbook:', error);
      throw error;
    }
  }

  // Create new logbook entry
  async createLogbook(logbookData: CreateLogbookRequest): Promise<{
    success: boolean;
    data: LogbookData;
    message: string;
  }> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(logbookData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create logbook');
      }

      return data;
    } catch (error) {
      console.error('Error creating logbook:', error);
      throw error;
    }
  }

  // Update logbook (approval/rejection by guru)
  async updateLogbook(
    id: number, 
    updateData: UpdateLogbookRequest
  ): Promise<{
    success: boolean;
    data: LogbookData;
    message: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update logbook');
      }

      return data;
    } catch (error) {
      console.error('Error updating logbook:', error);
      throw error;
    }
  }

  // Delete logbook
  async deleteLogbook(id: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete logbook');
      }

      return data;
    } catch (error) {
      console.error('Error deleting logbook:', error);
      throw error;
    }
  }

  // Get logbook statistics
  async getLogbookStats(): Promise<{
    success: boolean;
    data: LogbookStats;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: 'GET',
        credentials: 'same-origin',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch logbook stats');
      }

      return data;
    } catch (error) {
      console.error('Error fetching logbook stats:', error);
      throw error;
    }
  }
}

export const logbookService = new LogbookService();
