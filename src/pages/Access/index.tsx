import { PageContainer } from '@ant-design/pro-components';
import { DataCell, Frame } from '@antv/s2';
import { SheetComponent } from '@antv/s2-react';
import '@antv/s2-react/dist/style.min.css';
import { Access, useAccess } from '@umijs/max';
import { Button, Card } from 'antd';
// @ts-ignore
import insertCss from 'insert-css';
import { useEffect, useState } from 'react';
import data from './data';

insertCss(`
  .sheet-wrapper {
    background: #010138;
    padding: 16px;
  }
  .palette {
    display: flex;
    width: 100%;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .palette-group {
    display: flex;
  }
  .palette-color {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    
  }
  .palette-text {
    color: #FFF;
    width: 50px;
    font-size: 12px;
    padding-left: 8px;
  }
`);

const T = (text: string) => {
  return <Card title="antd card">{text}span</Card>;
};

const paletteLegendMap = [
  {
    text: '睡觉',
    color: '#6974EF',
  },
  {
    text: '工作',
    color: '#18E7CF',
  },

  {
    text: '上学',
    color: '#89E48A',
  },
  {
    text: '吃饭',
    color: '#FAE232',
  },
  {
    text: '学习',
    color: '#FAA140',
  },
  {
    text: '娱乐',
    color: '#E491BA',
  },
  {
    text: '运动',
    color: '#61AEFE',
  },
  {
    text: '其他',
    color: '#FAD5BB',
  },
];

class CustomDataCell extends DataCell {
  initCell() {
    this.drawInteractiveBgShape();
    this.drawCircle();
    this.drawBorderShape();
    if (JSON.stringify(this.meta.colQuery).includes('合计')) {
      this.drawTextShape();
    }
    this.update();
  }
  drawCircle() {
    const radius = 12;
    const { x, y, height, width, fieldValue, colQuery } = this.meta as any;
    const positionX = x + width / 2;
    const positionY = y + height / 2;

    let fill;
    let opacity = 1;
    if (!isNaN(fieldValue)) {
      fill =
        paletteLegendMap.find((v) => v.text === colQuery['时刻'])?.color ??
        '#FAD5BB';
      opacity = 0.5;
    } else {
      fill =
        paletteLegendMap.find((v) => v.text === fieldValue)?.color ?? '#FAD5BB';
    }
    this.backgroundShape = this.addShape('circle', {
      attrs: {
        x: positionX,
        y: positionY,
        width,
        height,
        fill,
        opacity,
        r: radius,
      },
    });
  }
}

class CustomFrame extends Frame {
  layout() {
    super.layout();
    // 水平二级分割线
    this.addHorizontalSplitLine();
    // 垂直二级分割线
    this.addVerticalSplitLine();
  }
  addHorizontalSplitLine() {
    const cfg = this.cfg;
    const {
      width,
      height,
      viewportWidth,
      position,
      scrollX,
      scrollContainsRowHeader,
      spreadsheet,
    } = cfg as any;
    const splitLine = spreadsheet.theme?.splitLine;
    const { rowsHierarchy } = spreadsheet.facet.layoutResult;
    const rootNodes = rowsHierarchy.getNodesLessThanLevel(0);
    rootNodes.forEach((node: any, key: any) => {
      if (key < rootNodes.length - 1) {
        const { children } = node;
        const lastChild = children[children.length - 1];
        const x1 = position.x;
        const x2 =
          x1 + width + viewportWidth + (scrollContainsRowHeader ? scrollX : 0);
        const y = position.y + height + lastChild.y + lastChild.height;
        this.addShape('line', {
          attrs: {
            x1,
            y1: y,
            x2,
            y2: y,
            stroke: splitLine.verticalBorderColor,
            lineWidth: 1,
            opacity: splitLine.verticalBorderColorOpacity,
          },
        });
      }
    });
  }

  addVerticalSplitLine() {
    const cfg = this.cfg;
    const { height, viewportHeight, position, width, spreadsheet } = cfg as any;
    const splitLine = spreadsheet.theme?.splitLine;
    const { colsHierarchy } = spreadsheet.facet.layoutResult;
    const rootNodes = colsHierarchy.getNodesLessThanLevel(0);
    rootNodes.forEach((node: any, key: any) => {
      if (key < rootNodes.length - 1) {
        const { children } = node;
        const lastChild = children[children.length - 1];
        const x = lastChild.x + lastChild.width + width;
        const y1 = position.y;
        const y2 = position.y + height + viewportHeight;
        this.addShape('line', {
          attrs: {
            x1: x,
            y1,
            x2: x,
            y2,
            stroke: splitLine.verticalBorderColor,
            lineWidth: 1,
            opacity: splitLine.verticalBorderColorOpacity,
          },
        });
      }
    });
  }
}

// class CustomTooltip extends BaseTooltip {}

const s2Theme = {
  colCell: {
    bolderText: {
      fontSize: 12,
      textAlign: 'center',
      fontWeight: 'normal',
    },

    cell: {
      horizontalBorderColorOpacity: 0.3,
      verticalBorderColorOpacity: 0.3,
    },
  },
  rowCell: {
    text: {
      textAlign: 'right',
    },
    cell: {
      horizontalBorderColorOpacity: 0.3,
      verticalBorderColorOpacity: 0.3,
    },
  },
  dataCell: {
    text: {
      textAlign: 'center',
    },
    cell: {
      horizontalBorderColorOpacity: 0.3,
      verticalBorderColorOpacity: 0.3,
    },
  },
  cornerCell: {
    bolderText: {
      textAlign: 'right',
    },
    cell: {
      horizontalBorderColorOpacity: 0.3,
      verticalBorderColorOpacity: 0.3,
    },
  },
  splitLine: {
    horizontalBorderColorOpacity: 0.3,
    horizontalBorderWidth: 2,

    shadowColors: {
      left: 'rgba(255,255,255, 0.3)',
      right: 'rgba(255,255,255, 0.01)',
    },
  },
} as any;

const s2Options = {
  width: 1150,
  height: 420,
  showDefaultHeaderActionIcon: false,
  dataCell: (viewMeta: any) => {
    return new CustomDataCell(viewMeta, viewMeta?.spreadsheet);
  },
  frame: (cfg: any) => {
    return new CustomFrame(cfg);
  },
  style: {
    layoutWidthType: 'compact',
    colCfg: {
      hideMeasureColumn: true,
    },
    cellCfg: {
      width: 40,
      height: 40,
    },
  },
  tooltip: {
    showTooltip: true,
    content: (p: any) => {
      console.log('p:', p.getMeta());
      return T('');
    },
    adjustPosition: (p: any) => {
      console.log(p);
      return {
        x: p.position.x - 1,
        y: p.position.y - 1,
      };
    },
  },
};

// 自定义单元格

const AccessPage: React.FC = () => {
  const access = useAccess();

  const PaletteLegend = () => (
    <div className="palette">
      {paletteLegendMap.map((value, key) => (
        <div key={key} className="palette-group">
          <span className="palette-color" style={{ background: value.color }} />
          <span className="palette-text">{value.text}</span>
        </div>
      ))}
    </div>
  );

  const s2Palette = {
    basicColors: [
      '#FFFFFF',
      '#020138',
      'rgba(255,255,255,0.18)',
      '#020138',
      'rgba(255,255,255,0.18)',
      '#7232CF',
      '#7232CF',
      '#AB76F7',
      '#020138',
      'rgba(255,255,255,0)',
      'rgba(255,255,255,0)',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
      '#FFFFFF',
    ],
    // ---------- semantic colors ----------
    semanticColors: {
      red: '#FF4D4F',
      green: '#29A294',
    },
  };

  const [s2DataConfig, ss] = useState<any>({});

  useEffect(() => {
    ss({
      data: data,
      fields: {
        rows: ['年龄', '成员'],
        columns: ['时间', '时刻'],
        values: ['活动'],
      },
    });
  }, []);

  return (
    <PageContainer
      ghost
      header={{
        title: '权限示例',
      }}
    >
      <Access accessible={access.canSeeAdmin}>
        <Button>只有 Admin 可以看到这个按钮</Button>
      </Access>

      <div className="sheet-wrapper">
        <PaletteLegend />
        <SheetComponent
          dataCfg={s2DataConfig}
          options={s2Options as any}
          sheetType="pivot"
          themeCfg={{ theme: s2Theme, palette: s2Palette }}
        />
      </div>
    </PageContainer>
  );
};

export default AccessPage;
