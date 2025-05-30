# SolverJS

O SolverJS é um conjunto de funções em Javascript para facilitar o uso nos projetos da SolverEdu.

### GERAL
---
### Z.ready
Executa ao terminar o carregamento da página
```javascript
Z.ready(() => {
	// your code here
})
```
ou
```javascript
Z.ready(async () => {
    await ... // your code here
})
```
---
### Z.processing
Exibe / oculta o cubo mágico processando
```javascript
Z.processing.show()
```
ou
```javascript
Z.processing.hide()
```
---
### Z.termsShow
Exibe os termos de uso da SolverEdu.   
Especificar o idioma (```pt```, ```es``` ou ```en```)
```javascript
Z.termsShow('appName', 'pt', res => {
    if (res === false) {
        Z.termsError('pt');
        return;
    }
});
Z.recordAccess('appName')
```
---
### Z.languageLoadDictionary
```javascript
await Z.languageLoadDictionary('dictionary.json');
```
---
## DOM   
Precisa sempre especificar ```#``` ou ```.```   

### Z.get
Recupera elemento pelo ID
```javascript
Z.get("#main")
```
---
### Z.html
Define html pelo ID
```javascript
Z.html("#main", "Hello World!")
```
---
### Z.hide
Oculta elemento(s) pelo ID ou CLASS
```javascript
Z.hide("#news")
```
ou
```javascript
Z.hide(".news")
```
---
### Z.show
Exibe elemento(s) pelo ID ou CLASS
```javascript
Z.show("#news")
```
ou
```javascript
Z.show(".news")
```
---
### Z.addClass
Adiciona classe pelo ID ou CLASS
```javascript
Z.addClass("#news", "pulse")
```
ou
```javascript
Z.addClass(".news", "pulse")
```
---
### Z.removeClass
Remove classe pelo ID ou CLASS
```javascript
Z.removeClass("#news", "pulse")
```
ou
```javascript
Z.removeClass(".news", "pulse")
```
---
## FORM
Não especificar ```#``` ou ```.```   

### Z.getInputText
```html
<input id="my-text">
```
```javascript
const myValue = Z.getInputText("my-text");
```
---
### Z.getInputTextarea
```html
<textarea id="my-textarea"></text> 
```
```javascript
const myValue = Z.getInputTextarea("my-textarea");
```
---
### Z.getInputRadio
```html
<input type="radio" name="my-radio" value="1"> Option 1 
<input type="radio" name="my-radio" value="2"> Option 2 
<input type="radio" name="my-radio" value="3"> Option 3
```
```javascript
const myValue = Z.getInputRadio("my-radio");
```
---
### Z.getInputCheckbox
```html
<input type="checkbox" id="my-checkbox">
```
```javascript
const myValue = Z.getInputCheckbox("my-checkbox");
```
---
### Z.getInputCheckboxes
```html
<input type="checkbox" class="my-checkbox"> Option 1
<input type="checkbox" class="my-checkbox"> Option 2
<input type="checkbox" class="my-checkbox"> Option 3
```
```javascript
const myValues = Z.getInputCheckboxes("my-checkbox");
```
---
### Z.getInputSelect
```html
<select id="my-select">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
</select>
```
```javascript
const myValue = Z.getInputSelect("my-select");
```
ou
```html
<select onchange="myFunction(this.value)">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
</select>
```
```javascript
window.myFunction = myFunction
function myFunction(value) {
    // your code here
}
```
---
## MODAL
### Z.modal
Exibe o modal
```javascript
Z.modal(title, body, showCloseIcon = true)
```
---
### Z.modalHide
Oculta o modal
```javascript
Z.modalHide()
```
