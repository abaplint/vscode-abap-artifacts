// todo, move all of this to configuration

function clas(name: string) {
  return `CLASS ${name.toLowerCase()} DEFINITION PUBLIC.
  PUBLIC SECTION.
ENDCLASS.

CLASS ${name.toLowerCase()} IMPLEMENTATION.

ENDCLASS.`;
}

function intf(name: string) {
  return `INTERFACE ${name.toLowerCase()} PUBLIC.

ENDINTERFACE.`;
}

function ddls(name: string) {
  return `define view entity ${name.toLowerCase()}
  as select from spfli
{
  key carrid    as Carrid,
  key connid    as Connid,
      countryfr as Countryfr,
      countryto as Countryto
}`;
}

function ddlx(name: string) {
  return `annotate entity foobar
  with
{
  @EndUserText.label: 'Carrier ID'
  Carrid;
}`;
}

function drty(name: string) {
  return `@EndUserText.label : 'This is a test label simple type'
@EndUserText.quickInfo : 'This is the quick info for the simple type'
define type ${name.toLowerCase()} : abap.char( 10 ); `;
}

function dteb(name: string) {
  return `define view entity buffer on foobar
  layer localization
  type single`;
}

export const affExtras: {[sdf: string]: {contents: (name: string) => string, extension: string}[]} = {
  "clas": [{contents: clas, extension: "abap"}],
  "ddls": [{contents: ddls, extension: "acds"}],
  "ddlx": [{contents: ddlx, extension: "acds"}],
  "drty": [{contents: drty, extension: "acds"}],
  "dteb": [{contents: dteb, extension: "acds"}],
  "intf": [{contents: intf, extension: "abap"}],
};