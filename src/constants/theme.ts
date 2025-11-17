import type { ThemeConfig } from 'antd';

const config: ThemeConfig = {
  token: {
    colorPrimary: '#8bc34a',
    colorLink: '#8bc34a',
    colorLinkActive: '#8bc34a',
    colorLinkHover: '#8bc34a',
    controlHeight: 32, // Ant Design 中按钮和输入框等基础控件的高度
  },
  components: {
    Button: {

    },
    Form: {
      labelColonMarginInlineEnd: 16,
    },
    Input: {

    },
    Select: {

    },
    InputNumber: {

    },
    Table: {
      cellPaddingBlockSM: 6,
      headerBg: '#FAFBFE',
      headerColor: '#999',
      headerSplitColor: '#FAFBFE',
      rowHoverBg: '#FAFBFE',
    }
  }
}

export default config;
