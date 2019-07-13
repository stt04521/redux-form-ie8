# Field Normalizing Example

When you need to put some control between what the user enters and the value that gets stored in 
Redux, you can use a "normalizer". A normalizer is just a function that gets run every time a 
value is changed that can transform the value before storing.

One common use case is when you need a value to be in a certain format, like a phone number or a 
credit card.

Normalizers are passed four parameters:

* `value` - The value of the field on which you have placed the normalizer
* `previousValue` - The value of the field on which you have placed the normalizer before the 
most recent change
* `allValues` - All the values in the form, with the current field value set
* `previousAllValues` - All the values in the form before the current field is changed

This allows you to do things like restrict one field value based on the value of another field, 
like the `min` and `max` fields in the example below. Notice that you cannot set `min` to be 
greater than `max`, and you cannot set `max` to be less than `min`.
