import cssua from "./cssua";

export class UserAgent {
  // OS
  static get windows() { return "Windows"; }
  static get macos() { return "Mac/iOS"; }
  static get ios() { return "ios"; }
  static get android() { return "android"; }
  static get linux() { return "Linux"; }
  
  // Browsers
  static get edge() { return "edge"; }
  static get chrome() { return "chrome"; }
  static get firefox() { return "firefox"; }
  static get safari() { return "safari"; }
  static get opera() { return "opera"; }
  static get ie() { return "ie"; }
  static get vivaldi() { return "vivaldi"; }

  // OS logic
  static get isWindows() { return cssua.userAgent.desktop === "windows"; }
  static get isMacos() { return cssua.userAgent.desktop === "macintosh"; }
  static get isLinux() { return cssua.userAgent.desktop === "linux"; }
  static get isUnix() { return cssua.userAgent.desktop === "unix"; }
  static get isAndroid() { return cssua.userAgent.mobile === "android"; }
  static get isIos() { return cssua.userAgent.mobile === "iphone" || cssua.userAgent.mobile === "ipad"; }
  static get isDesktop() { return this.isWindows || this.isMacos; }
  static get isMobile() { return this.isAndroid || this.isIos; }

  // Browser logic
  static get isEdge() { return cssua.userAgent.edge ? true : false; }
  static get isChrome() { return cssua.userAgent.chrome ? true : false; }
  static get isFirefox() { return cssua.userAgent.firefox ? true : false; }
  static get isSafari() { return cssua.userAgent.safari ? true : false; }
  static get isOpera() { return cssua.userAgent.opera ? true : false; }
  static get isVivaldi() { return cssua.userAgent.vivaldi ? true : false; }
  static get isIe() { return cssua.userAgent.ie ? true : false; }

  static get os() {
    if (this.isWindows) { return this.windows; }
    if (this.isMacos) { return this.macos; }
    if (this.isAndroid) { return this.android; }
    if (this.isIos) { return this.ios; }
    if (this.isLinux || this.isUnix ) { return this.linux; }
  }

  static get browser() {
    if (this.isEdge) { return this.edge; }
    if (this.isChrome) { return this.chrome; }
    if (this.isFirefox) { return this.firefox; }
    if (this.isSafari) { return this.safari; }
    if (this.isOpera) { return this.opera; }
    if (this.isVivaldi) { return this.vivaldi; }
    if (this.isIe) { return this.ie; }

  }
}
