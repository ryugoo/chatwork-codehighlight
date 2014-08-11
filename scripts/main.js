/*jshint jquery:true */
/*global TimeLineView:true, hljs:true */
(function () {
    'use strict';

    /**
     * Return true if message has code block tags.
     *
     * @param {String} message Original message text
     * @return {Boolean} true / false
     */
    var hasCodeBlockTag = function (message) {
        return (/\[cw:code\s?lang="[\s\S]*"\]/gmi).test(message);
    };

    /**
     * Revert <a> tag link to URL string.
     *
     * @param {String} Chat message.
     * @return {String} Chat message that has been converted.
     */
    var revertHtmlLink = function (message) {
        var new_message = message.replace(/&lt;a href="<a href="(.+?)" title=".+?" target="_blank".+?>.+?<\/a>&lt;\/a&gt;/gmi, '$1');
        if (new_message !== message) {
            return revertHtmlLink(new_message);
        }

        return message;
    };

    /**
     * Revert emoticon tags to original string.
     *
     * @param {String} Chat message.
     * @return {String} Chat message that has been converted.
     */
    var revertEmoticon = function (message) {
        var new_message = message.replace(/<img\s?.+?alt=\"(.+?)\".+?>/gmi, '$1');

        if (new_message !== message) {
            return revertEmoticon(new_message);
        }
        return message;
    };

    /**
     * Remove all html tags.
     *
     * @param {String} Chat message.
     * @return {String} Chat message that has been converted.
     */
    var removeHtmlTag = (function () {
        var $div = $('<div></div>');
        return function (str) {
            return $div.empty().html(str).text();
        };
    }());

    /**
     * Enable syntax highlighted message
     *
     * @param {String} Chat message.
     * @return {String} Chat message that has been converted.
     */
    var finalizeMessage = function (message) {
        message = message.replace(/</, '&lt;');
        message = message.replace(/>/, '&gt;');
        message = message.replace(/\[cw:code\s?lang=\"(.+?)\"\]/gmi, '<code style="font-family: monospace !important" class="$1 __CW__EX__">');
        message = message.replace(/\[\/cw:code\]/gmi, '<__CW__EX__/code>');
        message = message.replace(/__CW__EX__">\n/gmi, '">');
        message = message.replace(/\n<__CW__EX__/gmi, '<');
        return message;
    };

    /**
     * Convert message.
     *
     * @param {String} Chat message.
     * @return {String} Chat message that has been converted.
     */
    var convertMessage = function (message) {
        message = revertHtmlLink(message);
        message = revertEmoticon(message);
        message = removeHtmlTag(message);
        return finalizeMessage(message);
    };

    var onRenderTimeLine = function (timeline) {
        var $timeline = $('<div></div>').html(timeline),
            $messages = $timeline.find('.chatTimeLineMessage');

        if (!$messages.length) {
            return;
        }

        $messages.find('pre').each(function () {
            var $this = $(this),
                $msg = $this.html();

            // Convert message
            if ($msg && hasCodeBlockTag($msg)) {
                $this.html(convertMessage($msg));
            }
        });

        return $timeline.html();
    };

    var renderTimeLine = TimeLineView.prototype.renderTimeLine;
    TimeLineView.prototype.renderTimeLine = function (a, b) {
        b = onRenderTimeLine(b);
        renderTimeLine.apply(TimeLineView, [a, b]);

        // Enable syntax highlight
        hljs.initHighlighting.called = false;
        hljs.initHighlighting();
    };
}());
