require(["gitbook"], function (gitbook) {
  "use strict";

  var languageNames = {
    bash: "Shell",
    css: "CSS",
    html: "HTML",
    js: "JavaScript",
    json: "JSON",
    mermaid: "Mermaid",
    plain: "Plain text",
    py: "Python",
    python: "Python",
    sh: "Shell",
    sql: "SQL",
    text: "Plain text",
    ts: "TypeScript",
    tsx: "TypeScript React",
    yaml: "YAML",
    yml: "YAML"
  };

  function languageFor(code) {
    var classes = String(code.className || "").split(/\s+/);
    var language = "";

    classes.some(function (className) {
      var match = /^(?:lang|language)-(.+)$/.exec(className);
      if (match) {
        language = match[1].toLowerCase();
        return true;
      }
      return false;
    });

    return languageNames[language] || language.toUpperCase() || "Code";
  }

  function resetButton(button, language) {
    window.setTimeout(function () {
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy " + language + " code");
    }, 1800);
  }

  function copyWithSelection(source, code) {
    var textarea = document.createElement("textarea");
    textarea.value = source;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    var copied = document.execCommand("copy");
    document.body.removeChild(textarea);
    if (!copied) {
      var range = document.createRange();
      range.selectNodeContents(code);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
    return copied;
  }

  function copyCode(button, code, language) {
    var source = code.textContent.replace(/\n$/, "");
    var copyPromise = navigator.clipboard && navigator.clipboard.writeText
      ? navigator.clipboard.writeText(source).then(function () {
          return true;
        }).catch(function () {
          return copyWithSelection(source, code);
        })
      : new Promise(function (resolve) {
          resolve(copyWithSelection(source, code));
        });

    copyPromise.then(function (copied) {
      button.textContent = copied ? "Copied" : "Press ⌘/Ctrl+C";
      button.setAttribute(
        "aria-label",
        copied
          ? language + " code copied"
          : language + " code selected; press Command or Control C to copy"
      );
      resetButton(button, language);
    }).catch(function () {
      button.textContent = "Copy failed";
      button.setAttribute("aria-label", "Could not copy " + language + " code");
      resetButton(button, language);
    });
  }

  function applyDiagramAccessibility(diagram) {
    var svg = diagram.querySelector("svg");
    if (!svg) {
      return false;
    }

    var namespace = "http://www.w3.org/2000/svg";
    var suffix = String(Math.random()).slice(2);
    var title = svg.querySelector("title");
    var description = svg.querySelector("desc");

    if (!title && diagram.getAttribute("data-sa-acc-title")) {
      title = document.createElementNS(namespace, "title");
      title.textContent = diagram.getAttribute("data-sa-acc-title");
      svg.insertBefore(title, svg.firstChild);
    }
    if (!description && diagram.getAttribute("data-sa-acc-description")) {
      description = document.createElementNS(namespace, "desc");
      description.textContent = diagram.getAttribute("data-sa-acc-description");
      svg.insertBefore(description, title ? title.nextSibling : svg.firstChild);
    }

    if (title && !svg.getAttribute("aria-labelledby")) {
      title.id = title.id || "sa-diagram-title-" + suffix;
      svg.setAttribute("aria-labelledby", title.id);
    }
    if (description && !svg.getAttribute("aria-describedby")) {
      description.id = description.id || "sa-diagram-description-" + suffix;
      svg.setAttribute("aria-describedby", description.id);
    }
    svg.setAttribute("role", "graphics-document");
    return true;
  }

  function nearestHeading(diagram) {
    var headings = document.querySelectorAll(".markdown-section h2, .markdown-section h3");
    var preceding = null;

    Array.prototype.forEach.call(headings, function (heading) {
      if (heading.compareDocumentPosition(diagram) & Node.DOCUMENT_POSITION_FOLLOWING) {
        preceding = heading;
      }
    });
    return preceding ? preceding.textContent.trim() : "Voice agent architecture";
  }

  function prepareMermaidBlocks() {
    var diagrams = document.querySelectorAll(".markdown-section .mermaid");

    Array.prototype.forEach.call(diagrams, function (diagram) {
      var source = diagram.textContent || "";
      var title = source.match(/^\s*accTitle:\s*(.+)$/m);
      var description = source.match(/^\s*accDescr:\s*(.+)$/m);
      var pre = diagram.closest("pre");

      if (title) {
        diagram.setAttribute("data-sa-acc-title", title[1].trim());
      }
      if (description) {
        diagram.setAttribute("data-sa-acc-description", description[1].trim());
      }
      if (!title && !diagram.querySelector("title")) {
        var heading = nearestHeading(diagram);
        diagram.setAttribute("data-sa-acc-title", heading + " diagram");
        diagram.setAttribute(
          "data-sa-acc-description",
          "Diagram supporting the " + heading + " section."
        );
      }
      if (pre) {
        pre.classList.add("sa-mermaid-block");
      }

      if (applyDiagramAccessibility(diagram)) {
        return;
      }

      var observer = new MutationObserver(function () {
        if (applyDiagramAccessibility(diagram)) {
          observer.disconnect();
        }
      });
      observer.observe(diagram, { childList: true, subtree: true });
      window.setTimeout(function () {
        observer.disconnect();
        applyDiagramAccessibility(diagram);
      }, 3000);
    });
  }

  function enhanceCodeBlocks() {
    var blocks = document.querySelectorAll(".markdown-section pre > code");

    Array.prototype.forEach.call(blocks, function (code) {
      var pre = code.parentNode;
      if (!pre || pre.getAttribute("data-sa-code-enhanced") === "true") {
        return;
      }

      if (code.querySelector(".mermaid")) {
        pre.classList.add("sa-mermaid-block");
        return;
      }

      pre.setAttribute("data-sa-code-enhanced", "true");
      pre.classList.add("sa-code-block");

      var language = languageFor(code);
      var label = document.createElement("span");
      label.className = "sa-code-language";
      label.setAttribute("aria-hidden", "true");
      label.textContent = language;

      var button = document.createElement("button");
      button.type = "button";
      button.className = "sa-copy-code";
      button.setAttribute("aria-label", "Copy " + language + " code");
      button.textContent = "Copy";
      button.addEventListener("click", function () {
        copyCode(button, code, language);
      });

      pre.appendChild(label);
      pre.appendChild(button);
    });
  }

  gitbook.events.bind("page.change", function () {
    prepareMermaidBlocks();
    enhanceCodeBlocks();
  });
});
