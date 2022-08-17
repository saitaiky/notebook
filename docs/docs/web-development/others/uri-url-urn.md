---
title: URI, URL & URN
---


## URI 

> [Uniform Resource Identifier](https://en.wikipedia.org/wiki/Uniform_resource_identifier)

URIs are a standard for identifying documents using a short string of numbers, letters, and symbols. They are defined by [RFC 3986 - Uniform Resource Identifier (URI): Generic Syntax](https://www.rfc-editor.org/rfc/rfc3986). URLs, URNs, and URCs are all *types* of URI.

## URL 

> [Uniform Resource Locator](https://en.wikipedia.org/wiki/Uniform_resource_locator)

Contains information about how to fetch a resource from its location. For example:

-   `http://example.com/mypage.html`
-   `ftp://example.com/download.zip`
-   `mailto:user@example.com`
-   `file:///home/user/file.txt`
-   `tel:1-888-555-5555`
-   `http://example.com/resource?foo=bar#fragment`
-   `/other/link.html` (A relative URL, only useful in the context of another URL)

URLs always start with a protocol (`http`) and usually contain information such as the network host name (`example.com`) and often a document path (`/foo/mypage.html`). URLs may have query parameters and fragment identifiers.

## URN 

> [Uniform Resource Name](https://en.wikipedia.org/wiki/Uniform_resource_name)

Identifies a resource by a unique and persistent name, but doesn't necessarily tell you how to locate it on the internet. It usually starts with the prefix `urn:` For example:

-   `urn:isbn:0451450523` to identify a book by its ISBN number.
-   `urn:uuid:6e8bc430-9c3a-11d9-9669-0800200c9a66` a globally unique identifier
-   `urn:publishing:book` - An XML namespace that identifies the document as a type of book.

URNs can identify ideas and concepts. They are not restricted to identifying documents. When a URN does represent a document, it can be translated into a URL by a "resolver". The document can then be downloaded from the URL.

## Examples

> Source: [What is the difference between a URI, a URL, and a URN?](https://stackoverflow.com/questions/176264/what-is-the-difference-between-a-uri-a-url-and-a-urn)

A URI identifies, a URL identifies and locates; however, locators are also identifiers, so every URL is also a URI, but there are URIs which are not URLs.


### Example(follow syntax)

Consider a specific edition of Shakespeare's play Romeo and Juliet, of which you have a digital copy on your home network.

You could identify the text as `urn:isbn:0-486-27557-4`.
That would be a URI, but more specifically a **Uniform Resource Name(URN)** because it **names the text**.

You could also identify the text as `file://hostname/sharename/RomeoAndJuliet.pdf`.
That would also be a URI, but more specifically a **URL** because it **locates the text**.


### Example(not follow syntax)

#### URI

`Sai Tai` is my name, which is an identifier. It is like a URI, but cannot be a URL, as it tells you nothing about my location or how to contact me. In this case it also happens to identify at least 5 other people in the USA alone.

#### URL

`4914 West Bay Street, Nassau, Bahamas` is a locator, which is an identifier for that physical location. It is like both a URL and URI (since all URLs are URIs), and also identifies me indirectly as "resident of..". In this case it uniquely identifies me, but that would change if I get a roommate.

I say "like" because these examples *do not follow the required syntax*.

:::caution Popular confusion

From [Wikipedia](http://en.wikipedia.org/wiki/Uniform_Resource_Locator):

In computing, a Uniform Resource Locator (URL) is a subset of the Uniform Resource Identifier (URI) that specifies where an identified resource is available and the mechanism for retrieving it. **In popular usage and in many technical documents and verbal discussions it is often incorrectly used as a synonym for URI**, ... 
:::

#### URN

My name, `Sai Tai`, could be like a [URN](http://en.wikipedia.org/wiki/Uniform_Resource_Name) (Uniform Resource Name), except those are [much more regulated](https://stackoverflow.com/questions/2135450/why-is-urn-one-of-more-popular-formats-used-to-uniquely-identify-the-resource/3083561#3083561) and intended to be unique across *both* space and time.

Because I currently share this name with other people, it's not globally unique and would not be appropriate as a URN. However, even if no other family used this name, I'm named after my paternal grandfather, so it still wouldn't be unique across time. And even if *that* wasn't the case, the possibility of naming my descendants after me make this unsuitable as a URN. (Elon Musk's son XÆA-Xii is much more unique across time and space right?)

URNs are different from URLs in this rigid uniqueness constraint, even though they both share the syntax of URIs.


## 2015 definition update

![url-uri-urn](/img/web-development/others/url-uri-urn.png)

**But doesn't the W3C now say that URLs and URIs are the same thing?**

Yes. The W3C realized that there is a ton of confusion about this. They issued a [URI clarification document](http://www.w3.org/TR/uri-clarification/) that says that it is now OK to use the terms URL and URI interchangeably (to mean URI). It is no longer useful to strictly segment URIs into different types such as URL, URN, and URC.

**Can a URI be both a URL and a URN?**

The definition of URN is now looser than what I stated above. The [latest RFC on URIs](http://tools.ietf.org/pdf/rfc3986.pdf) says that any URI can now be a URN (regardless of whether it starts with `urn:`) as long as it has "the properties of a name." That is: It is globally unique and persistent even when the resource ceases to exist or becomes unavailable. An example: The URIs used in HTML doctypes such as `http://www.w3.org/TR/html4/strict.dtd`. That URI would continue to name the HTML4 transitional doctype even if the page on the w3.org website were deleted.

