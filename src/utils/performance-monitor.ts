/**
 * 性能监控工具
 */
class PerformanceMonitor {
  private startTimes = new Map<string, number>();
  private metrics = new Map<string, number[]>();

  /**
   * 开始计时
   */
  start(label: string): void {
    this.startTimes.set(label, performance.now());
  }

  /**
   * 结束计时并记录
   */
  end(label: string): number {
    const startTime = this.startTimes.get(label);
    if (!startTime) {
      console.warn(`No start time found for: ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.startTimes.delete(label);

    // 记录到指标中
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label)!.push(duration);

    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  /**
   * 获取指标统计
   */
  getStats(label: string): { avg: number; min: number; max: number; count: number } | null {
    const values = this.metrics.get(label);
    if (!values || values.length === 0) {
      return null;
    }

    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    };
  }

  /**
   * 打印所有统计信息
   */
  printAllStats(): void {
    console.log('📊 Performance Statistics:');
    for (const [label, values] of this.metrics.entries()) {
      const stats = this.getStats(label);
      if (stats) {
        console.log(`  ${label}:`, {
          average: `${stats.avg.toFixed(2)}ms`,
          min: `${stats.min.toFixed(2)}ms`,
          max: `${stats.max.toFixed(2)}ms`,
          samples: stats.count
        });
      }
    }
  }

  /**
   * 清除所有数据
   */
  clear(): void {
    this.startTimes.clear();
    this.metrics.clear();
  }
}

// 导出单例实例
export const perfMonitor = new PerformanceMonitor();

// 开发环境下自动在控制台显示性能统计
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // 每30秒打印一次统计信息
  setInterval(() => {
    perfMonitor.printAllStats();
  }, 30000);
}
