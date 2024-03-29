/*****
 * Copyright (c) 2017-2023 Kode Programming
 * https://github.com/KodeProgramming/kode/blob/main/LICENSE
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
*****/


/*****
 * Default CSS colors for the built in style sheet.  If the developer does not
 * provide alternate colors in the thunk file, either for the module in general,
 * or for the Webx specifically, use these standard organization colors for the
 * dark and light color schemes of various HTML widgets.
*****/
global.webxCssVars = {
    light: {
        widget_border_width: '1px',
        widget_border_radius: '5px',
        widget_outline_width: '2px',

        widget_color: '#2F4F5F',
        widget_background_color: '#FFFFFF',
        widget_border_color: '#C0C0C0',

        widget_hover_color: '#2F4F5F',
        widget_hover_background_color: '#F9F9F9',
        widget_hover_border_color: '#C0C0C0',

        widget_focus_color: '#646464',
        widget_focus_background_color: '#FFFFFF',
        widget_focus_border_color: '#C0C0C0',
        widget_focus_outline_color: '#FF8C00',

        widget_disabled_color: '#BBBBBB',
        widget_disabled_background_color: '#FFFFFF',
        widget_disabled_border_color: '#ECECEC',

        widget_error_color: '#DC143C',
        widget_error_background_color: '#FFF9F9',
        widget_error_border_color: '#DC143C',

        nav_color: '#4682B4',
        nav_background_color: '#F2F2F2',
        nav_border: 'solid 1px #DDDDDD',

        menu_color: '#2F4F5F',
        menu_background_color: '#F9F9F9',
        menu_hover_color: '#2F4F5F',
        menu_hover_background_color: '#DDDDDD',
        menu_disabled_color: '#BBBBBB',
        menu_disabled_background_color: '#F9F9F9',
        menu_separator: 'solid 1px #244F5F',
        menu_separator_lite: 'solid 1px #DFDFDF',
        menu_font_family: 'Arial',
        menu_font_size: '17px',
        menu_font_weight: 'Thin',
        menu_min_height: '30px',

        main_color: '#2F4F5F',
        main_background_color: '#FFFFFF',
        main_border_color: '#778899',
        main_outline_color: '#FF8C00',
        main_hover_color: '#2F4F4F',
        main_hover_background_color: '#787878',

        alt_color: '#4682B4',
        alt_background_color: '#FDFDFD',
        alt_border_color: '#B0C4DE',
        alt_outline_color: '#FF8C00',
        alt_hover_color: '#2F4F4F',
        alt_hover_background_color: '#FF8C00',

        dialog_color: '#828282',
        dialog_background_color: '#FFFFFF',
        dialog_border: 'solid 2px #B0C4DE',
        dialog_border_radius: '7px',

        framing_color: '#2F4F5F',
        framing_background_color: '#FBFBFB',
        framing_border: 'solid 1px #E3E3E3',
        framing_border_radius: '6px',
    },
    dark: {
        widget_border_width: '1px',
        widget_border_radius: '5px',
        widget_outline_width: '2px',

        widget_color: '#FFFFFF',
        widget_background_color: '#000000',
        widget_border_color: '#565656',

        widget_hover_color: '#FFFFFF',
        widget_hover_background_color: '#222222',
        widget_hover_border_color: '#565656',

        widget_focus_color: '#FFFFFF',
        widget_focus_background_color: '#000000',
        widget_focus_border_color: '#565656',
        widget_focus_outline_color: '#FF8C00',

        widget_disabled_color: '#A9A9A9',
        widget_disabled_background_color: '#000000',
        widget_disabled_border_color: '#454545',

        widget_error_color: '#DC143C',
        widget_error_background_color: '#222222',
        widget_error_border_color: '#DC143C',

        menu_color: '#FFFFFF',
        menu_background_color: '#222222',
        menu_hover_color: '#C0C0C0',
        menu_hover_background_color: '#444444',
        menu_disabled_color: '#777777',
        menu_disabled_background_color: '#222222',
        menu_separator: 'solid 1px #FFFFFF',
        menu_separator_lite: 'solid 1px #373737',
        menu_font_family: 'Arial',
        menu_font_size: '17px',
        menu_font_weight: 'Thin',
        menu_min_height: '30px',

        main_color: '#FFFFFF',
        main_background_color: '#000000',
        main_border_color: '#F0F8FF',
        main_outline_color: '#FF8C00',
        main_hover_color: '#2F4F4F',
        main_hover_background_color: '#787878',

        alt_color: '#B0C4DE',
        alt_background_color: '#222222',
        alt_border_color: '#4682B4',
        alt_outline_color: '#FF8C00',
        alt_hover_color: '#2F4F4F',
        alt_hover_background_color: '#FF8C00',

        dialog_color: '#B0C4DE',
        dialog_background_color: '#222222',
        dialog_border: 'solid 2px #4682B4',
        dialog_border_radius: '7px',

        framing_color: '#FFFFFF',
        framing_background_color: '#040404',
        framing_border: 'solid 1px #0A0A0A',
        framing_border_radius: '6px',
    }
};
