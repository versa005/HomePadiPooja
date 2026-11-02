/**
 * Home Padi Pooja — private Google Sheets RSVP dashboard.
 * Add this as a NEW Apps Script file Dashboard.gs in the spreadsheet-bound project.
 * Run setupRsvpDashboard once from Apps Script. Keep the spreadsheet private.
 */
function setupRsvpDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const raw = ss.getSheetByName('RSVPs');
  if (!raw) {
    SpreadsheetApp.getUi().alert('No RSVPs tab yet. Submit a test RSVP from your website first, then run setupRsvpDashboard.');
    return;
  }
  const headers = raw.getRange(1,1,1,Math.max(9,raw.getLastColumn())).getDisplayValues()[0];
  const required = ['Timestamp','Event ID','Name','Phone','Email','Response','Adults','Children','Message'];
  if (!required.every((h,i)=>headers[i]===h)) {
    SpreadsheetApp.getUi().alert('The RSVPs tab must contain these columns in order: '+required.join(', '));
    return;
  }
  let sh = ss.getSheetByName('Dashboard');
  if (!sh) sh = ss.insertSheet('Dashboard');
  sh.clear();
  sh.getRange('A1:H2').merge().setValue('ॐ  HOME PADI POOJA  •  RSVP DASHBOARD  ॐ')
    .setBackground('#733A20').setFontColor('#FFF1C9').setFontFamily('Georgia')
    .setFontSize(19).setFontWeight('bold').setHorizontalAlignment('center')
    .setVerticalAlignment('middle');
  sh.setRowHeights(1,2,34);
  sh.getRange('A4').setValue('Event ID');
  sh.getRange('B4').setValue('All events').setBackground('#FFF5DC');
  sh.getRange('D4:H4').merge().setValue('Select an event ID or All events')
    .setFontColor('#785F44').setFontStyle('italic');
  sh.getRange('J1').setValue('All events');
  sh.getRange('J2').setFormula('=IFERROR(SORT(UNIQUE(FILTER(RSVPs!B2:B,RSVPs!B2:B<>""))),"")');
  const rule = SpreadsheetApp.newDataValidation().requireValueInRange(sh.getRange('J1:J1000'),true).setAllowInvalid(false).build();
  sh.getRange('B4').setDataValidation(rule);
  sh.hideColumns(10);
  const metrics=[
    ['A6','Total RSVPs','=IF($B$4="All events",COUNTA(RSVPs!C2:C),COUNTIF(RSVPs!B2:B,$B$4))'],
    ['C6','Confirmed Families','=IF($B$4="All events",COUNTIF(RSVPs!F2:F,"Yes*"),COUNTIFS(RSVPs!B2:B,$B$4,RSVPs!F2:F,"Yes*"))'],
    ['E6','Confirmed Adults','=IF($B$4="All events",SUMIF(RSVPs!F2:F,"Yes*",RSVPs!G2:G),SUMIFS(RSVPs!G2:G,RSVPs!B2:B,$B$4,RSVPs!F2:F,"Yes*"))'],
    ['G6','Confirmed Children','=IF($B$4="All events",SUMIF(RSVPs!F2:F,"Yes*",RSVPs!H2:H),SUMIFS(RSVPs!H2:H,RSVPs!B2:B,$B$4,RSVPs!F2:F,"Yes*"))'],
    ['A9','Maybe','=IF($B$4="All events",COUNTIF(RSVPs!F2:F,"Maybe*"),COUNTIFS(RSVPs!B2:B,$B$4,RSVPs!F2:F,"Maybe*"))'],
    ['C9','Declined','=IF($B$4="All events",COUNTIF(RSVPs!F2:F,"No*"),COUNTIFS(RSVPs!B2:B,$B$4,RSVPs!F2:F,"No*"))'],
    ['E9','Confirmed Total Guests','=E7+G7'],
    ['G9','Response Rate','Not tracked']
  ];
  metrics.forEach(([cell,label,formula])=>{
    const col=sh.getRange(cell).getColumn(),row=sh.getRange(cell).getRow();
    sh.getRange(row,col,1,2).merge().setValue(label).setBackground('#E8D2A4')
      .setFontColor('#66371F').setFontWeight('bold').setHorizontalAlignment('center');
    const value=sh.getRange(row+1,col,1,2).merge().setBackground('#FFF7E7')
      .setFontSize(24).setFontColor('#8C451D').setFontWeight('bold').setHorizontalAlignment('center');
    if (formula.startsWith('=')) value.setFormula(formula); else value.setValue(formula);
  });
  sh.getRange('A13:I13').setValues([required]).setBackground('#733A20')
    .setFontColor('#FFF1C9').setFontWeight('bold');
  // QUERY is recalculated when a guest submits an RSVP or the selected event changes.
  sh.getRange('A14').setFormula(
    '=IFERROR(IF($B$4="All events",FILTER(RSVPs!A2:I,RSVPs!C2:C<>""),FILTER(RSVPs!A2:I,RSVPs!B2:B=$B$4,RSVPs!C2:C<>"")),"No responses for this selection")'
  );
  sh.setFrozenRows(13);
  sh.setColumnWidths(1,9,130);
  sh.setColumnWidth(3,170);
  sh.setColumnWidth(5,210);
  sh.setColumnWidth(9,220);
  sh.getRange('A4:B4').setFontWeight('bold');
  sh.getRange('A14:A').setNumberFormat('mmm d, yyyy h:mm AM/PM');
  sh.setTabColor('#B4812D');
  ss.setActiveSheet(sh);
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('Dashboard created! Keep this Google Sheet restricted to your organizer account.');
}
