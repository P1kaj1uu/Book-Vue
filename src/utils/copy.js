export function copyRichArticle (area, vm) {
  let transfer = document.createElement('input');
  document.body.appendChild(transfer);
  transfer.value = area;
  transfer.focus();
  transfer.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
  }
  transfer.blur();
  document.body.removeChild(transfer);
  vm.$message({
    type: 'success',
    message: '复制成功',
  })
}
