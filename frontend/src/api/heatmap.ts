import request from './client';
import { HeatmapData } from './types';

export const getHeatmap = () => request<HeatmapData>('/heatmap');
