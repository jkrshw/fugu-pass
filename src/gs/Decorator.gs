/*
    Copyright 2013 Jesse Kershaw jesse.kershaw+fugupass@gmail.com
        
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var theme = {
  labelStyle : {
    fontWeight: 'bold',
    fontSize: '16px'
  },
  
  textInputStyle: {
    width: '100%'
  },
  
  formStyle : {
    width: '350px',
    padding: '20px',
    margin: '20px auto 20px'
  },
  
  buttonStyle : {
    minWidth: '55px',
    margin: '0px 5px 0px 0px'
  },
  
  buttonPanelStyle : {
    marginTop: '10px'
  },
  
  loadingStlye: {
    margin: '0px 0px 0px',
    float: 'right'
  }
}

/* 
 *  Decorators 
 */
function getDecoratedLoadingLabel(text) {
  return UiApp.getActiveApplication().createLabel(text).setStyleName('loading-text').setStyleAttributes(theme.loadingStlye);
}

function getDecoratedFormPanel(app) {
  return app.createFlowPanel().setStyleAttributes(theme.formStyle); 
}

function getDecoratedTextInput() {
  return UiApp.getActiveApplication().createTextBox().setStyleAttributes(theme.textInputStyle);
}

function getDecoratedPasswordInput() {
  return UiApp.getActiveApplication().createPasswordTextBox().setStyleAttributes(theme.textInputStyle);
}

function getDecoratedButtonPanel(app) {
  return app.createFlowPanel().setStyleAttributes(theme.buttonPanelStyle); 
}

function getDecoratedButton(text) {
  return UiApp.getActiveApplication().createButton(text).setStyleAttributes(theme.buttonStyle);
}

function getDecoratedLabel(app, text) {
  return app.createLabel(text).setStyleAttributes(theme.labelStyle);
}