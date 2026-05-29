import axiosClient from '@/utils/axiosClient';
import { TargetRow } from '@/components/monthTarget';
import { DayPlanRow } from '@/components/dayPlan';

export const PlanService = {
  getGoal: async (studentId: string, month: number, year: number) => {
    const response = await axiosClient.get(`/plan/goal`, {
      params: { studentId, month, year },
    });
    return response.data;
  },

  createOrUpdateGoal: async (data: {
    studentId: string;
    month: number;
    year: number;
    goals: TargetRow[];
    status: 'draft' | 'submitted';
  }) => {
    const response = await axiosClient.post(`/plan/goal`, data);
    return response.data;
  },

  getDailyActions: async (studentId: string, startDate: string, endDate: string) => {
    const response = await axiosClient.get(`/plan/daily/week`, {
      params: { studentId, startDate, endDate },
    });
    return response.data;
  },

  createOrUpdateDailyAction: async (data: {
    studentId: string;
    date: Date | string;
    tasks: DayPlanRow[];
    reflection: string;
    selfScore?: number;
    status: 'draft' | 'submitted';
  }) => {
    const response = await axiosClient.post(`/plan/daily`, data);
    return response.data;
  },

  getDailyActionsForTeacher: async (status?: 'submitted' | 'reviewed') => {
    const response = await axiosClient.get(`/plan/daily/teacher`, {
      params: { status },
    });
    return response.data;
  },

  reviewDailyAction: async (data: {
    actionId: string;
    teacherComment: string;
    teacherScore: number;
  }) => {
    const response = await axiosClient.put(`/plan/daily/review`, data);
    return response.data;
  },
};
