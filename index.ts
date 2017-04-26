var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var TAGS_BLOCK = /^p|div|pre|form$/;

export function getText(contentEditableElement: HTMLDivElement): string {
  //
  // thanks https://github.com/diy/jquery-emojiarea
  //
  var lines: Array<string> = [];
  var line = '';

  var flush = function () {
    lines.push(line);
    line = '';
  };
  document.getElementById('a')

  var sanitizeNode = function (node: Node) {
    if (node.nodeType === TEXT_NODE) {
      line += node.nodeValue;
    } else if (node.nodeType === ELEMENT_NODE) {
      var tagName = node.nodeName.toLowerCase();
      var isBlock = TAGS_BLOCK.test(tagName);

      if (isBlock && line) {
        flush();
      }

      if (tagName === 'br') {
        flush();
      }

      var children = node.childNodes;
      for (var i = 0; i < children.length; i++) {
        sanitizeNode(children[i]);
      }

      if (isBlock && line) {
        flush();
      }
    }
  };

  var childNodes = contentEditableElement.childNodes;
  for (var i = 0; i < childNodes.length; i++) {
    sanitizeNode(childNodes[i]);
  }

  if (line.length) {
    flush();
  }

  return lines.join('\n');
};

export function getHtml(text: string): string {
  return text.replace(/\n/g, '<br>');
};

export function getWordRangeBeforeCaret(): { word: string, range: Range | null } {
  var word = '', range = null, offset, text, selection, node;
  if (window.getSelection) {
    selection = window.getSelection();
    if (selection.rangeCount) {
      range = selection.getRangeAt(0).cloneRange();
      if (range.startContainer === range.endContainer &&
        range.startOffset === range.endOffset) {
        offset = range.endOffset;
        node = range.endContainer;
        text = node.textContent ? node.textContent.substring(0, offset) : '';
        word = text.split(/\s+/).pop()!;
        range.setStart(node, offset - word.length);
      }
    }
  }
  return {
    word: word,
    range: range
  };
};
