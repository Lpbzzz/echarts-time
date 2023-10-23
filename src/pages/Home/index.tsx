import { PageContainer } from '@ant-design/pro-components';
import * as echarts from 'echarts';
import { useEffect } from 'react';
import styles from './index.less';

const HomePage: React.FC = () => {
  useEffect(() => {
    const chartDom = document.getElementById('main');
    console.log('chartDom:', chartDom);
    const myChart = echarts.init(chartDom);
    let option;

    let data: any = [];
    let dataCount = 500;
    let startTime = +new Date();
    let categories = [
      'categoryA',
      'categoryB',
      'categoryC',
      'categoryD',
      'categoryE',
    ];
    let colors = ['#5590F6', '#44C69D', '#FFA22D', '#896BFF', '#858B9B'];
    let types = [
      { name: 'JS Heap', color: '#7b9ce1' },
      { name: 'Documents', color: '#7b9ce1' },
      { name: 'Nodes', color: '#7b9ce1' },
      { name: 'Listeners', color: '#7b9ce1' },
      { name: 'GPU Memory', color: '#7b9ce1' },
      { name: 'GPU', color: '#7b9ce1' },
    ];
    // Generate mock data
    categories.forEach(function (category, index) {
      let baseTime = startTime;
      for (let i = 0; i < dataCount; i++) {
        let typeItem = types[0];
        let duration = 1000 * 60;
        data.push({
          name: typeItem.name,
          value: [index, baseTime, (baseTime += duration), duration],
          itemStyle: {
            normal: {
              color: colors[index],
              borderCap: 'round',
            },
          },
        });
        baseTime += duration * 2;
      }
    });

    option = {
      tooltip: {
        formatter: function (params: any) {
          return params.marker + params.value[1] + '';
        },
      },
      title: {
        text: 'Profile',
        left: 'center',
      },
      dataZoom: [
        {
          type: 'slider',
          filterMode: 'weakFilter',
          showDataShadow: false,
          top: 380,
          labelFormatter: '',
          show: false,
        },
        {
          type: 'slider',
          filterMode: 'weakFilter',
          showDataShadow: false,
          top: 50,
          labelFormatter: '',
          show: false,
        },
        {
          type: 'inside',
          filterMode: 'weakFilter',
          show: false,
        },
      ],
      grid: {
        height: 300,
      },
      xAxis: {
        type: 'time',
      },
      yAxis: {
        data: categories,
        show: false,
      },
      series: [
        {
          type: 'scatter',

          itemStyle: {
            opacity: 1,
          },
          encode: {
            x: [1, 2],
            y: 0,
          },
          data: data,
        },
      ],
    };

    if (option) {
      myChart.setOption(option);
    }
  }, []);

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <div id="main" style={{ width: '100%', height: 400 }}></div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
