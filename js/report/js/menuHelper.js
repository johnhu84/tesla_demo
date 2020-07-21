function populatePageAndTableSpacings() {
    console.log('populatePageAndTableSpacings...');
    document.getElementById('pageSpacingUpDown').value = globalObj.spacing.pageSpacingUpDown;
    document.getElementById('pageSpacingLeftRight').value = globalObj.spacing.pageSpacingLeftRight;
    document.getElementById('chartSpacingUpDown').value = globalObj.spacing.chartSpacingUpDown;
    document.getElementById('chartSpacingLeftRight').value = globalObj.spacing.chartSpacingLeftRight
}