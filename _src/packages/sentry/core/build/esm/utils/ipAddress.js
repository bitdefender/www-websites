function e(d){d.user?.ip_address===void 0&&(d.user={...d.user,ip_address:"{{auto}}"})}function r(d){"aggregates"in d?d.attrs?.ip_address===void 0&&(d.attrs={...d.attrs,ip_address:"{{auto}}"}):d.ipAddress===void 0&&(d.ipAddress="{{auto}}")}export{r as addAutoIpAddressToSession,e as addAutoIpAddressToUser};
//# sourceMappingURL=ipAddress.js.map
