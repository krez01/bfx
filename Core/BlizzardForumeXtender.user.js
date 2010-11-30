//alert($); // check if the dollar (jquery) function works
//alert($().jquery); // check jQuery version

function BFXmain() {
    //instant quote
	cachedQuotes = {};
	$('#thread div[id|="post"]').each(function(index) {
	    postid = $(this).attr('id').split("-")[1];
			if ($('.post-interior',this).html().replace(/\n/g,"") != "")
			{
			    //alert($(this).parent().html());
			    bmlcontent = BML.toBml($('.post-detail',this).html());
			    //alert(index + ': ' + bmlcontent);
			    userName = $('.context-link',this).text().replace(/\n/g,"");
			    //alert(verboseEscape(userName));
				cachedQuotes[postid] = {"name":userName,"detail":bmlcontent};
			}
	})
    //Inject the cached quotes we made locally
	document.body.appendChild(document.createElement("script")).innerHTML="Cms.Topic.cachedQuotes = " + JSON.stringify(cachedQuotes) + ";";
	
}

function verboseEscape(string) {
	string = string.replace(/\n/g, "\\n")
	.replace(/\r/g, "\\r")
	.replace(/\t/g, "\\t");
	return string;
}

function stripSig(postBodyString)
{
    if (/\n_{48}\n/.test(postBodyString))
    {
        return postBodyString.split("________________________________________________")[0];
	}
	else
	{
        postBodyString = postBodyString.replace(/\n_{10,}(\n[^\n]*){1,5}$/, "");
        return postBodyString;
	}
}

var BML = {
    /**
     * Transform the code loosely to HTML.
     *
     * @param string content
     * @return string
     */
    toHtml: function(content) {
        if (!content)
            content = BML.textarea.val();

        content = BML.encode(content);
        content = content.replace(/\[b\]/gi, '<strong>');
        content = content.replace(/\[\/b\]/gi, '</strong>');
        content = content.replace(/\[i\]/gi, '<em>');
        content = content.replace(/\[\/i\]/gi, '</em>');
        content = content.replace(/\[u\]/gi, '<span class="underline">');
        content = content.replace(/\[\/u\]/gi, '</span>');
        content = content.replace(/\[li\]/gi, '<li>');
        content = content.replace(/\[\/li\]/gi, '</li>');
        content = content.replace(/\[ul\]/gi, '<ul>');
        content = content.replace(/\[\/ul\]/gi, '</ul>');
        content = content.replace(/\[quote="(.*?)" id="(.*?)" page="(.*?)"\]/gi, '<blockquote><strong>'+ Msg.bml.quoteBy.replace('{0}', '$1') +'</strong><br />');
        content = content.replace(/\[quote="(.*?)"\]/gi, '<blockquote><strong>'+ Msg.bml.quoteBy.replace('{0}', '$1') +'</strong><br />');
        content = content.replace(/\[quote\]/gi, '<blockquote>');
        content = content.replace(/\[\/quote\]/gi, '</blockquote>');
        content = content.replace(/\n/gi, '<br />');
        content = content.replace(/\r/gi, '<br />');

        // Cleanup
        content = content.replace(/<ul><br(.*?)>/gim, '<ul>');
        content = content.replace(/<\/li><br(.*?)>/gim, '</li>');
        
        return content;
    },

    /**
     * Transform the HTML loosely to BML.
     *
     * @param string content
     * @return string
     */
    toBml: function(content) {
        content = content.replace(/ xmlns="(.*?)"/gi, ''); // Remove xhtml namespace
		content = content.replace(/<\/?a[^><]*>/g,"");//filter out any links already present, since the only ones that are parsed with this are ones added by the forum
        content = content.replace(/<strong>/gi, '[b]');
        content = content.replace(/<\/strong>/gi, '[/b]');
        content = content.replace(/<em>/gi, '[i]');
        content = content.replace(/<\/em>/gi, '[/i]');
        content = content.replace(/<span class="?underline"?>/gi, '[u]');
        content = content.replace(/<\/span>/gi, '[/u]');
        content = content.replace(/<li>/gi, '[li]');
        content = content.replace(/<\/li>/gi, '[/li]');
        content = content.replace(/<ul>/gi, '[ul]');
        content = content.replace(/<\/ul>/gi, '[/ul]');
        content = content.replace(/<blockquote[^><]*>(.*?)<div class="?quote-author"?>(.*?)<\/div>/gim, '[quote="$2"]');
        content = content.replace(/<blockquote[^><]*>/gi, '[quote]');
        content = content.replace(/<\/blockquote>/gi, '[/quote]');
        content = content.replace(/<br(.*?)>/gi, (""));
		content = stripSig(content);
        content = BML.decode(content);

        return content;
    },

    /**
     * Encode HTML strings.
     *
     * @param string string
     */
    encode: function(string) {
        return string.replace(/</gi, '&lt;').replace(/>/gi, '&gt;').replace(/&/gi, '&amp;').replace(/"/gi, '&quot;');
    },
    decode: function(string) {
        return string.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"');
    }
};