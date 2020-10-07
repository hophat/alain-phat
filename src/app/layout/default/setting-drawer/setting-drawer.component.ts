import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, NgZone } from '@angular/core';
import { Layout, SettingsService } from '@delon/theme';
import { copy, deepCopy, LazyService } from '@delon/util';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

const ALAINDEFAULTVAR = 'alain-default-vars';
const DEFAULT_COLORS = [
  {
    key: 'dust',
    color: '#F5222D',
  },
  {
    key: 'volcano',
    color: '#FA541C',
  },
  {
    key: 'sunset',
    color: '#FAAD14',
  },
  {
    key: 'cyan',
    color: '#13C2C2',
  },
  {
    key: 'green',
    color: '#52C41A',
  },
  {
    key: 'daybreak',
    color: '#1890ff',
  },
  {
    key: 'geekblue',
    color: '#2F54EB',
  },
  {
    key: 'purple',
    color: '#722ED1',
  },
  {
    key: 'black',
    color: '#001529',
  },
];
const DEFAULT_VARS: { [key: string]: NzSafeAny } = {
  'primary-color': { label: '主颜色', type: 'color', default: '#1890ff' },
  'alain-default-header-hg': {
    label: 'cao',
    type: 'px',
    default: '64px',
    max: 300,
    min: 24,
  },
  'alain-default-header-bg': {
    label: 'Màu nền',
    type: 'color',
    default: '@primary-color',
    tip: 'Màu chính giống nhau theo mặc định',
  },
  'alain-default-header-padding': {
    label: 'Phần đệm trên cùng bên trái và bên phải',
    type: 'px',
    default: '16px',
  },
  // 侧边栏
  'alain-default-aside-wd': {
    label: 'chiều rộng  ',
    type: 'px',
    default: '200px',
  },
  'alain-default-aside-bg': {
    label: 'lý lịch    ',
    type: 'color',
    default: '#ffffff',
  },
  'alain-default-aside-collapsed-wd': {
    label: 'Thu hẹp chiều rộng    ',
    type: 'px',
    default: '64px',
  },
  'alain-default-aside-nav-padding-top-bottom': {
    label: 'Phần đệm trên và dưới    ',
    type: 'px',
    default: '8px',
    step: 8,
  },
  // 主菜单
  'alain-default-aside-nav-fs': {
    label: 'Kích thước phông chữ menu    ',
    type: 'px',
    default: '14px',
    min: 14,
    max: 30,
  },
  'alain-default-aside-collapsed-nav-fs': {
    label: 'Thu nhỏ kích thước phông chữ menu    ',
    type: 'px',
    default: '24px',
    min: 24,
    max: 32,
  },
  'alain-default-aside-nav-item-height': {
    label: 'Chiều cao mục menu    ',
    type: 'px',
    default: '38px',
    min: 24,
    max: 64,
  },
  'alain-default-aside-nav-text-color': {
    label: 'Màu văn bản menu    ',
    type: 'color',
    default: 'rgba(0, 0, 0, 0.65)',
    rgba: true,
  },
  'alain-default-aside-nav-text-hover-color': {
    label: 'Màu di chuột qua menu văn bản    ',
    type: 'color',
    default: '@primary-color',
    tip: 'Màu chính giống nhau theo mặc định    ',
  },
  'alain-default-aside-nav-group-text-color': {
    label: 'Màu văn bản nhóm menu    ',
    type: 'color',
    default: 'rgba(0, 0, 0, 0.43)',
    rgba: true,
  },
  'alain-default-aside-nav-selected-text-color': {
    label: 'Màu văn bản khi menu được kích hoạt    ',
    type: 'color',
    default: '@primary-color',
    tip: 'Màu chính giống nhau theo mặc định    ',
  },
  'alain-default-aside-nav-selected-bg': {
    label: 'Màu nền khi menu được kích hoạt    ',
    type: 'color',
    default: '#fcfcfc',
  },
  // 内容
  'alain-default-content-bg': {
    label: 'Màu nền    ',
    type: 'color',
    default: '#f5f7fa',
  },
  'alain-default-content-heading-bg': {
    label: 'Màu nền tiêu đề    ',
    type: 'color',
    default: '#fafbfc',
  },
  'alain-default-content-heading-border': {
    label: 'Màu đường viền ở cuối tiêu đề    ',
    type: 'color',
    default: '#efe3e5',
  },
  'alain-default-content-padding': {
    label: 'Lề bên trong    ',
    type: 'px',
    default: '24px',
    min: 0,
    max: 128,
    step: 8,
  },
  // zorro组件修正
  'form-state-visual-feedback-enabled': {
    label: 'Bật phản hồi trực quan của các thành phần biểu mẫu    ',
    type: 'switch',
    default: true,
  },
  'preserve-white-spaces-enabled': {
    label: 'Bật KeepWhitespaces    ',
    type: 'switch',
    default: true,
  },
  'nz-table-img-radius': {
    label: 'Trong bảng: hình ảnh bo tròn góc    ',
    type: 'px',
    default: '4px',
    min: 0,
    max: 128,
  },
  'nz-table-img-margin-right': {
    label: 'Trong bảng: lề phải của hình ảnh    ',
    type: 'px',
    default: '4px',
    min: 0,
    max: 128,
  },
  'nz-table-img-max-width': {
    label: 'Trong bảng: chiều rộng tối đa của hình ảnh    ',
    type: 'px',
    default: '32px',
    min: 8,
    max: 128,
  },
  'nz-table-img-max-height': {
    label: 'Trong bảng: chiều cao tối đa của hình ảnh    ',
    type: 'px',
    default: '32px',
    min: 8,
    max: 128,
  },
};

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'setting-drawer',
  templateUrl: './setting-drawer.component.html',
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.setting-drawer]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingDrawerComponent {
  private loadedLess = false;

  collapse = false;
  get layout(): Layout {
    return this.settingSrv.layout;
  }
  data: any = {};
  color: string;
  colors = DEFAULT_COLORS;

  constructor(
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService,
    private settingSrv: SettingsService,
    private lazy: LazyService,
    private zone: NgZone,
    @Inject(DOCUMENT) private doc: any,
  ) {
    this.color = this.cachedData['@primary-color'] || this.DEFAULT_PRIMARY;
    this.resetData(this.cachedData, false);
  }

  private get cachedData(): { [key: string]: any } {
    return this.settingSrv.layout[ALAINDEFAULTVAR] || {};
  }

  private get DEFAULT_PRIMARY(): string {
    return DEFAULT_VARS['primary-color'].default;
  }

  private loadLess(): Promise<void> {
    if (this.loadedLess) {
      return Promise.resolve();
    }
    return this.lazy
      .loadStyle('./assets/color.less', 'stylesheet/less')
      .then(() => {
        const lessConfigNode = this.doc.createElement('script');
        lessConfigNode.innerHTML = `
          window.less = {
            async: true,
            env: 'production',
            javascriptEnabled: true
          };
        `;
        this.doc.body.appendChild(lessConfigNode);
      })
      .then(() => this.lazy.loadScript('https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js'))
      .then(() => {
        this.loadedLess = true;
      });
  }

  private genVars(): any {
    const { data, color, validKeys } = this;
    const vars: any = {
      [`@primary-color`]: color,
    };
    validKeys.filter((key) => key !== 'primary-color').forEach((key) => (vars[`@${key}`] = data[key].value));
    this.setLayout(ALAINDEFAULTVAR, vars);
    return vars;
  }

  private runLess(): void {
    const { zone, msg, cdr } = this;
    const msgId = msg.loading(`正在编译主题！`, { nzDuration: 0 }).messageId;
    setTimeout(() => {
      zone.runOutsideAngular(() => {
        this.loadLess().then(() => {
          (window as any).less.modifyVars(this.genVars()).then(() => {
            msg.success('成功');
            msg.remove(msgId);
            zone.run(() => cdr.detectChanges());
          });
        });
      });
    }, 200);
  }

  toggle(): void {
    this.collapse = !this.collapse;
  }

  changeColor(color: string): void {
    this.color = color;
    Object.keys(DEFAULT_VARS)
      .filter((key) => DEFAULT_VARS[key].default === '@primary-color')
      .forEach((key) => delete this.cachedData[`@${key}`]);
    this.resetData(this.cachedData, false);
  }

  setLayout(name: string, value: any): void {
    this.settingSrv.setLayout(name, value);
  }

  private resetData(nowData?: { [key: string]: NzSafeAny }, run: boolean = true): void {
    nowData = nowData || {};
    const data = deepCopy(DEFAULT_VARS);
    Object.keys(data).forEach((key) => {
      const value = nowData![`@${key}`] || data[key].default || '';
      data[key].value = value === `@primary-color` ? this.color : value;
    });
    this.data = data;
    if (run) {
      this.cdr.detectChanges();
      this.runLess();
    }
  }

  private get validKeys(): string[] {
    return Object.keys(this.data).filter((key) => this.data[key].value !== this.data[key].default);
  }

  apply(): void {
    this.runLess();
  }

  reset(): void {
    this.color = this.DEFAULT_PRIMARY;
    this.settingSrv.setLayout(ALAINDEFAULTVAR, {});
    this.resetData({});
  }

  copyVar(): void {
    const vars = this.genVars();
    const copyContent = Object.keys(vars)
      .map((key) => `${key}: ${vars[key]};`)
      .join('\n');
    copy(copyContent);
    this.msg.success('Copy success');
  }
}
