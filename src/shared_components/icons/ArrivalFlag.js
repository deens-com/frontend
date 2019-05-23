import React from 'react';
import SvgWithProps from './SvgWithProps';

const ArrivalFlag = SvgWithProps(({ onClick, ariaHidden, focusable, role, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
    focusable={focusable.toString()}
    role={role}
    style={style}
    onClick={onClick}
    viewBox="0 0 19 19"
  >
    <path
      d="M2.35721 18.5222C2.14026 18.5222 1.96436 18.3463 1.96436 18.1294V0.843662C1.96436 0.626707 2.14026 0.450806 2.35721 0.450806C2.57417 0.450806 2.75007 0.626707 2.75007 0.843662V18.1294C2.75007 18.3463 2.57417 18.5222 2.35721 18.5222Z"
      fill="#444444"
    />
    <path d="M6.28571 2.02222H2.75V5.55793H6.28571V2.02222Z" fill="#444444" />
    <path d="M9.82135 2.02222H6.28564V5.55793H9.82135V2.02222Z" fill="#E6E6E6" />
    <path d="M13.357 2.02222H9.82129V5.55793H13.357V2.02222Z" fill="#444444" />
    <path d="M16.8926 2.02222H13.3569V5.55793H16.8926V2.02222Z" fill="#E6E6E6" />
    <path d="M6.28571 5.55786H2.75V9.09357H6.28571V5.55786Z" fill="#E6E6E6" />
    <path d="M9.82135 5.55798H6.28564V9.0937H9.82135V5.55798Z" fill="#444444" />
    <path d="M13.357 5.55798H9.82129V9.09369H13.357V5.55798Z" fill="#E6E6E6" />
    <path d="M16.8926 5.55798H13.3569V9.09369H16.8926V5.55798Z" fill="#444444" />
    <path d="M6.28571 9.09363H2.75V12.6293H6.28571V9.09363Z" fill="#444444" />
    <path d="M9.82135 9.09363H6.28564V12.6293H9.82135V9.09363Z" fill="#E6E6E6" />
    <path d="M13.357 9.09363H9.82129V12.6293H13.357V9.09363Z" fill="#444444" />
    <path d="M16.8926 9.09363H13.3569V12.6293H16.8926V9.09363Z" fill="#E6E6E6" />
  </svg>
));

export default ArrivalFlag;
