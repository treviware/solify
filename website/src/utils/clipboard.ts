export async function copyToClipboard(text: string): Promise<void> {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    } else {
        const el = document.createElement('textarea');
        el.value = text;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        const selected = (document.getSelection()?.rangeCount || 0) > 0 ? document.getSelection()?.getRangeAt(0) :
            false;
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        if (selected) {
            document.getSelection()?.removeAllRanges();
            document.getSelection()?.addRange(selected);
        }
    }
}