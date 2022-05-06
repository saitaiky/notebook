---
title: "CSS"
metaTitle: "CSS"
metaDescription: "ABC"
---


[A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#flexbox-background)


# Inherit, initial and unset
## Intro
- Inherit is probably the easiest to understand, what it basically says is, ‘I will inherit this value from my parent’. 
- Initial says, ‘hey just take the browser default for this value’.
- Unset says, ‘if there is a parent with a matching value, then I will act as inherit, otherwise I will act as initial’.


![initial-diagram](/img/web-development/others/css/initial-diagram.jpg)
H1 is looking to inherit a color value, which it finds in the body element.

![initial-diagram-inherit](/img/web-development/others/css/initial-diagram-inherit.jpg)
H1 is told to use its initial value, so it skips over the body element and goes to its roots.


## References 
- [Getting Acquainted with Initial](https://css-tricks.com/getting-acquainted-with-initial/)
- [Inherit, Initial and Unset Values for CSS Properties](https://alligator.io/css/inherit-initial-unset/)