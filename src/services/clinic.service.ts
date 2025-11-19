// Serviços de configurações da clínica

import api from './api';
import type { ClinicSettings, ClinicSettingsResponse } from '../types/clinic.types';

export const clinicService = {
  /**
   * Busca configurações da clínica
   */
  async getSettings(): Promise<ClinicSettings> {
    const response = await api.get<ClinicSettingsResponse>('/clinic/settings');
    return response.data.data;
  },

  /**
   * Atualiza configurações da clínica
   */
  async updateSettings(data: ClinicSettings): Promise<ClinicSettings> {
    const response = await api.put<ClinicSettingsResponse>('/clinic/settings', data);
    return response.data.data;
  },
};
