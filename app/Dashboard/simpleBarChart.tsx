import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type SimpleBarChartProps = {
  data: {
    labels: string[];
    datasets: { data: number[] }[];
  };
  width: number;
  height: number;
  yAxisSuffix?: string;
};

const SimpleBarChart = ({
  data,
  width,
  height,
  yAxisSuffix = '',
}: SimpleBarChartProps) => {
  if (!data || !data.datasets || !data.labels) return null;
  
  const values = data.datasets[0].data;
  const maxValue = Math.max(...values, 0.1);
  const barWidth = (width - 50) / values.length;
  
  return (
    <View style={[styles.container, { width, height }]}>
      {data.labels.map((label, index) => {
        const value = values[index];
        const barHeight = (value / maxValue) * (height - 80);
        
        return (
          <View key={index} style={[styles.barWrapper, { width: barWidth }]}>
            <Text style={styles.barValue}>
              {value.toFixed(1)}{yAxisSuffix}
            </Text>
            <View style={[styles.bar, { height: barHeight }]} />
            <Text style={styles.barLabel} numberOfLines={1}>
              {label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  barWrapper: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 40,
    backgroundColor: 'rgb(0, 136, 204)',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginBottom: 5,
  },
  barLabel: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 5,
    width: '100%',
  },
  barValue: {
    color: '#fff',
    fontSize: 10,
    marginBottom: 5,
  },
});

export default SimpleBarChart;