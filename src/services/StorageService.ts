import { AppState } from '../types';

export class StorageService {
  private static readonly STORAGE_KEY = 'taskdefender_app_state';
  private static readonly BACKUP_KEY = 'taskdefender_backup';

  static async saveAppState(state: AppState): Promise<void> {
    try {
      const serializedState = JSON.stringify(state, (key, value) => {
        // Convert Date objects to ISO strings
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
      
      localStorage.setItem(this.STORAGE_KEY, serializedState);
      
      // Create backup
      const backup = {
        timestamp: new Date().toISOString(),
        data: serializedState,
      };
      localStorage.setItem(this.BACKUP_KEY, JSON.stringify(backup));
    } catch (error) {
      console.error('Failed to save app state:', error);
      throw error;
    }
  }

  static async loadAppState(): Promise<AppState | null> {
    try {
      const serializedState = localStorage.getItem(this.STORAGE_KEY);
      if (!serializedState) {
        return null;
      }

      const state = JSON.parse(serializedState, (key, value) => {
        // Convert ISO strings back to Date objects
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      });

      return state;
    } catch (error) {
      console.error('Failed to load app state:', error);
      return null;
    }
  }

  static async exportData(): Promise<string> {
    try {
      const state = await this.loadAppState();
      if (!state) {
        throw new Error('No data to export');
      }

      const exportData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        data: state,
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  static async importData(jsonData: string): Promise<void> {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.data) {
        throw new Error('Invalid import data format');
      }

      await this.saveAppState(importData.data);
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.BACKUP_KEY);
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw error;
    }
  }

  static async restoreFromBackup(): Promise<AppState | null> {
    try {
      const backupData = localStorage.getItem(this.BACKUP_KEY);
      if (!backupData) {
        return null;
      }

      const backup = JSON.parse(backupData);
      const state = JSON.parse(backup.data, (key, value) => {
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      });

      return state;
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      return null;
    }
  }
}