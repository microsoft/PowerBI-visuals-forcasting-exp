module powerbi.extensibility.visual.PBI_CV_8EDDC07B_EE79_4418_A84C_D73897C0E21F_HTML  {
  let injectorCounter: number = 0;

  export function ResetInjector() : void {
    injectorCounter = 0;
  }

  export function injectorReady() : boolean {
    return injectorCounter === 0;
  }
  
  export function ParseElement(el: HTMLElement , target: HTMLElement) : Node[]
  {
    let arr: Node[] = [];
    if (!el || !el.hasChildNodes())
        return
        
    let nodes = el.children;
    for (var i=0; i<nodes.length; i++)
    {
      let tempNode: HTMLElement; 
      if (nodes.item(i).nodeName.toLowerCase() === 'script'){
        tempNode = createScriptNode(nodes.item(i));
      }
      else
      {
        tempNode = <HTMLElement>nodes.item(i).cloneNode(true);
      }
      target.appendChild(tempNode);
      arr.push(tempNode);
    }
    return arr;
  }
  
  function createScriptNode(refNode: Element): HTMLElement{
    let script = document.createElement('script');
    let attr = refNode.attributes;
    for (var i=0; i<attr.length; i++)
    {
      script.setAttribute(attr[i].name, attr[i].textContent);

      if (attr[i].name.toLowerCase() === 'src') {
        // waiting only for src to finish loading
        injectorCounter++;
        script.onload = function() {
            injectorCounter--;
        };
      }
    }

    script.innerHTML = refNode.innerHTML;  
    return script;
  }

  export function RunHTMLWidgetRenderer(): void {
    let intervalVar = window.setInterval(() => {
      if (injectorReady()) {
        window.clearInterval(intervalVar);
        if (window.hasOwnProperty('HTMLWidgets') && window['HTMLWidgets'].staticRender) {
          window['HTMLWidgets'].staticRender();
        }
      }
    }, 100);
  }
}