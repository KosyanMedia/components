angular.module('Components').service('KeyCodes', [function(){
  var key_codes = {
    8: "BACKSPACE",
    9: "TAB",
    13: "ENTER",
    16: "SHIFT",
    17: "CONTROL",
    18: "ALT",
    20: "CAPS_LOCK",
    27: "ESCAPE",
    32: "SPACE",
    33: "PAGE_UP",
    34: "PAGE_DOWN",
    35: "END",
    36: "HOME",
    37: "LEFT",
    38: "UP",
    39: "RIGHT",
    40: "DOWN",
    45: "INSERT",
    46: "DELETE",
    91: "WINDOWS",
    93: "MENU",
    106: "NUMPAD_MULTIPLY",
    107: "NUMPAD_ADD",
    108: "NUMPAD_ENTER",
    109: "NUMPAD_SUBTRACT",
    110: "NUMPAD_DECIMAL",
    111: "NUMPAD_DIVIDE",
    188: "COMMA",
    190: "PERIOD"
  };
  return {
    get: function(keycode){
      return key_codes[keycode] || "TYPE";
    }
  };
}]);
