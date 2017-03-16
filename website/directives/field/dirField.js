app.directive('dirField', function(){
  return {
    restrict:'E',
    templateUrl:'directives/field/dirField.html',
    scope:{
      field:'=field'
    },
    controller: function($scope){
      var field = $scope.field
      field.valid = true

      if (typeof field.helptext == 'undefined') {field.helptext = ''}
      if (typeof field.value    == 'undefined') {field.value    = ''}

      if (field.placeholder == '') {
        if (field.min != '') {
          if (field.placeholder != '') { field.placeholder += ', ' }
          if (field.max != '') {
            field.placeholder += field.min+' to '+field.max
          } else {
            field.placeholder += 'min: '+field.min
          }
        } else if (field.max != '') {
          if (field.placeholder != '') { field.placeholder += ', ' }
          field.placeholder += 'max: '+field.max
        }
        if (field.minlength != '') {
          if (field.placeholder != '') { field.placeholder += ', ' }
          if (field.maxlength != '') {
            field.placeholder += 'length: '+field.minlength+' to '+field.maxlength
          } else {
            field.placeholder += 'min length: '+field.minlength
          }
        } else if (field.maxlength != '') {
          if (field.placeholder != '') { field.placeholder += ', ' }
          field.placeholder += 'max length: '+field.maxlength
        }
        if (field.required) {
          if (field.placeholder != '') { field.placeholder += ', ' }
          field.placeholder += 'required'
        }
      }

      if (field.required && field.value == '')                            { field.valid = false; if (field.helptext != '') { field.helptext += ', ' }; field.helptext += 'Required' }
      if (field.min != '' && field.value < field.min )                    { field.valid = false; if (field.helptext != '') { field.helptext += ', ' }; field.helptext += 'Minimum '+field.min }
      if (field.max != '' && field.value > field.max )                    { field.valid = false; if (field.helptext != '') { field.helptext += ', ' }; field.helptext += 'Maximum '+field.max }
      if (field.minlength != '' && field.value.length < field.minlength ) { field.valid = false; if (field.helptext != '') { field.helptext += ', ' }; field.helptext += 'Minimum Length '+field.minlength }
      if (field.maxlength != '' && field.value.length > field.maxlength ) { field.valid = false; if (field.helptext != '') { field.helptext += ', ' }; field.helptext += 'Maximum Length '+field.maxlength }

      $scope.field = field

      $scope.check = function(field, type) {
        if (field.required && field.value == '')                              { field.valid = false }
        if (field.min != '' && field.value < field.min )                      { field.valid = false }
        if (field.max != '' && field.value > field.max )                      { field.valid = false }
        if (typeof field.value != 'undefined' && field.value != undefined) {
          if (field.minlength != '' && field.value.length < field.minlength )   { field.valid = false }
          if (field.maxlength != '' && field.value.length > field.maxlength )   { field.valid = false }
        }
        if (type == 'class' && field.valid)                                   { return "form-control-danger" }
        if (type == 'group_class' && field.valid)                             { return "has-danger" }
        return field.valid
      }

    }
  }
})
