---
title: "Bash practical"
metaTitle: "Syntax Highlighting is the meta title tag for this page"
metaDescription: "This is the meta description for this page"
---

http://linux.vbird.org/linux_basic/0320bash.php#returnvar
http://linux.vbird.org/linux_basic/0340bashshell-scripts.php


## Wildcards and symbols

<table>
  <tr>
    <th>Symbols</th>
    <th>Meaning</th>
  </tr>
  <tr>
    <td>*</td>
    <td>代表『 0 個到無窮多個』任意字元</td>
  </tr>
  <tr>
    <td>?</td>
    <td>代表『一定有一個』任意字元</td>
  </tr>
  <tr>
    <td>[ ]	</td>
    <td>同樣代表『一定有一個在括號內』的字元(非任意字元)。例如 [abcd] 代表『一定有一個字元， 可能是 a, b, c, d 這四個任何一個』</td>
  </tr>
  <tr>
    <td>[ - ]	</td>
    <td>若有減號在中括號內時，代表『在編碼順序內的所有字元』。例如 [0-9] 代表 0 到 9 之間的所有數字，因為數字的語系編碼是連續的！</td>
  </tr>
  <tr>
    <td>[^ ]</td>
    <td>若中括號內的第一個字元為指數符號 (^) ，那表示『反向選擇』，例如 [^abc] 代表 一定有一個字元，只要是非 a, b, c 的其他字元就接受的意思。
    </td>
  </tr>
</table>

```bash
範例一：找出 /etc/ 底下以 cron 為開頭的檔名
$ ll -d /etc/cron*    <==加上 -d 是為了僅顯示目錄而已

範例二：找出 /etc/ 底下檔名『剛好是五個字母』的檔名
$ ll -d /etc/?????    <==由於 ? 一定有一個，所以五個 ? 就對了

範例三：找出 /etc/ 底下檔名含有數字的檔名
$ ll -d /etc/*[0-9]*  <==記得中括號左右兩邊均需 *

範例四：找出 /etc/ 底下，檔名開頭非為小寫字母的檔名：
$ ll -d /etc/[^a-z]*  <==注意中括號左邊沒有 *

範例五：將範例四找到的檔案複製到 /tmp/upper 中
$ mkdir /tmp/upper; cp -a /etc/[^a-z]* /tmp/upper
```

## 環境變數的功能

env & set
用 env 觀察環境變數與常見環境變數說明
用 set 觀察所有變數 (含環境變數與自訂變數)

```bash

$ echo $SHELL
/bin/bash              <==可順利顯示！沒有錯誤！

$ echo $?
0                      <==因為沒問題，所以回傳值為 0

$ 12name=VBird
bash: 12name=VBird: command not found...   <==發生錯誤了！bash回報有問題

$ echo $?
127                    <==因為有問題，回傳錯誤代碼(非為0)
# 錯誤代碼回傳值依據軟體而有不同，我們可以利用這個代碼來搜尋錯誤的原因喔！

$ echo $?
0
# 咦！怎麼又變成正確了？這是因為 "?" 只與『上一個執行指令』有關，
# 所以，我們上一個指令是執行『 echo $? 』，當然沒有錯誤，所以是 0 沒錯！
```
$? expands to the exit status of the most recently executed foreground pipeline.

[Special Parameters section of the Bash manual] (http://www.gnu.org/software/bash/manual/html_node/Special-Parameters.html#Special-Parameters)




## Command Redirect / Process substitution

In Linux/Unix, everything is a file. Regular file, Directories, and even Devices are files. Every File has an associated number called **File Descriptor (FD)**.

Your screen also has a File Descriptor. When a program is executed the output is sent to File Descriptor of the screen, and you see program output on your monitor. If the output is sent to File Descriptor of the printer, the program output would have been printed.

Whenever you execute a program/command at the terminal, 3 files are always open, viz., standard input, standard output, standard error.

![streams](/img/linux/redirection.jpg)

These files are always present whenever a program is run. As explained before a file descriptor, is associated with each of these files.
<table>
  <tr>
    <th>File</th>
    <th>File Descriptor</th>
  </tr>
  <tr>
    <td>Standard Input STDIN</td>
    <td>0</td>
  </tr>
  <tr>
    <td>Standard Output STDOUT</td>
    <td>1</td>
  </tr>
  <tr>
    <td>Standard Error STDERR</td>
    <td>2</td>
  </tr>
</table>


### Standard output and Standard error output:
```bash
>         ：將原本由螢幕輸出的正確資料輸出到 > 右邊的 file ( 檔案名稱 ) 或 device ( 裝置，如 printer )去；
>>        ：Appending more content to an existing file.
2>        ：將原本應該由螢幕輸出的錯誤資料輸出到 2> 的右邊去。
/dev/null ：可以說成是黑洞裝置！

# 將顯示的結果輸出到 list.txt 檔案中，若該檔案以存在則予以取代！
ls -al >  list.txt

# 將顯示的結果累加到 list.txt 檔案中，該檔案為累加的，舊資料保留！
ls -al >> list.txt

# 將顯示的資料，正確的輸出到 list.txt 錯誤的資料輸出到 list.err
ls -al 1> list.txt 2> list.err

# 將顯示的資料，不論正確或錯誤均輸出到 list.txt 當中！
ls -al 1> list.txt 2>&1

# 將顯示的資料，正確的輸出到 list.txt 錯誤的資料則予以丟棄！
ls -al 1> list.txt 2> /dev/null

注意！錯誤與正確檔案輸出到同一個檔案中，則必須以上面的方法來寫！
不能寫成其他格式！
```
### Standard input

Many commands can accept input from a facility called standard input. By default, standard input gets its contents from the keyboard, but like standard output, it can be redirected. To redirect standard input from *a file* instead of *the keyboard*, the "<" character is used like this. 以最簡單的說法來說， 那就是『將原本需要由鍵盤輸入的資料，改由檔案內容來取代』的意思。:

```bash
$ sort < file_list.txt
```
In the example above, we used the sort command to process the contents of file_list.txt. The results are output on the display since the standard output was not redirected. We could redirect standard output to another file like this:
```bash
$ sort < file_list.txt > sorted_file_list.txt
```
As you can see, a command can have both its input and output redirected. Be aware that the order of the redirection does not matter. The only requirement is that the redirection operators (the "<" and ">") must appear after the other options and arguments in the command.

### Why do we need command redirect?
- 當螢幕輸出的資訊很重要，而且我們需要將他存下來的時候；
- 背景執行中的程式，不希望他干擾螢幕正常的輸出結果時；
- 一些系統的例行命令（例如寫在 /etc/crontab 中的檔案）的執行結果，希望他可以存下來時；
- 一些執行命令，我們已經知道他可能的錯誤訊息，所以想以『 2> /dev/null 』將他丟掉時；
錯誤訊息與正確訊息需要分別輸出時。

### Summary
- Each file in Linux has a corresponding File Descriptor associated with it
The keyboard is the standard input device while your screen is the standard output device
- `>` is the output redirection operator. ">>" appends output to an existing file
- `<` is the input redirection operator
- `>&`re-directs output of one file to another.
- ` `` ` 兩個『 ` 』中間為可以先執行的指令，亦可使用 $()


## $? (指令回傳值) 與 && 或 ||
如同上面談到的，兩個指令之間有相依性，而這個相依性主要判斷的地方就在於前一個指令執行的結果是否正確。 還記得本章之前我們曾介紹過指令回傳值吧！嘿嘿！沒錯，您真聰明！就是透過這個回傳值啦！ 再複習一次『若前一個指令執行的結果為正確，在 Linux 底下會回傳一個 $? = 0 的值』。 那麼我們怎麼透過這個回傳值來判斷後續的指令是否要執行呢？這就得要藉由『 && 』及『 || 』的幫忙了！ 注意喔，兩個 & 之間是沒有空格的！那個 | 則是 [Shift]+[\] 的按鍵結果。

<table>
  <tr>
    <th>指令下達情況</th>
    <th>Meaning</th>
  </tr>
  <tr>
    <td rowspan="2">cmd1 && cmd2</td>
    <td>
    - 若 cmd1 執行完畢且正確執行($?=0)，則開始執行 cmd2。
    </td>
  </tr>
  <tr>
    <td>
    - 若 cmd1 執行完畢且為錯誤 ($?≠0)，則 cmd2 不執行。
    </td>
  </tr>
  <tr>
    <td rowspan="2">cmd1 || cmd2</td>
    <td>
      - 若 cmd1 執行完畢且正確執行($?=0)，則 cmd2 不執行。
    </td>
  </tr>
  <tr>
    <td>
      - 若 cmd1 執行完畢且為錯誤 ($?≠0)，則開始執行 cmd2。
    </td>
  </tr>
</table>

```bash
範例：我不清楚 /tmp/abc 是否存在，但就是要建立 /tmp/abc/hehe 檔案
$ ls /tmp/abc || mkdir /tmp/abc && touch /tmp/abc/hehe
```
![command](/img/linux/cmd_1.gif)

上面這張圖顯示的兩股資料中，上方的線段為不存在 /tmp/abc 時所進行的指令行為，下方的線段則是存在 /tmp/abc 所在的指令行為。如上所述，下方線段由於存在 /tmp/abc 所以導致 $?=0 ，讓中間的 mkdir 就不執行了！ 並將 $?=0 繼續往後傳給後續的 touch 去利用啦！

## Pipe & Command substitution

### Pipe
就如同前面所說的， bash 命令執行的時候有輸出的資料會出現！那麼如果這群資料必需要經過幾道手續之後才能得到我們所想要的格式，應該如何來設定？這就牽涉到管線命令的問題了（ pipe ），管線命令使用的是『 | 』這個界定符號！另外，管線命令與『連續下達命令』是不一樣的呦！這點底下我們會再說明。底下我們先舉一個例子來說明一下簡單的管線命令。
假設我們要讀取 last 這個指令中，那個 root 登入的『次數』應該怎麼作？注意呦！我們只需要『次數』。那麼我所進行的步驟是：

```bash
執行 last ，將所有這個月的所有人登入資料取出來；
使用 grep 將上面的輸出資料（stdout）當中的 root 擷取出來，其他的不要；
使用 wc 這個可以計算行數的指令將上一步的資料計算行數！
[test @test bin]# last
[test @test bin]# last | grep root
[test @test bin]# last | grep root | wc -l
```
這個管線命令『 | 』僅能處理經由前面一個指令傳來的正確資訊，也就是 standard output ( STDOUT ) 的資訊，對於 stdandard error 並沒有直接處理的能力!

![pip flow image](/img/linux/pip-flow.jpg)

### Command substitution

"Command substitution" is the name of the feature of the shell language that allows you to execute a command and have the output of that command replace (substitute) the text of the command. These commands are executed in a subshell, and their  data is what the substitution syntax expands to.

The command that the command substitution executes, is executed in a subshell, which means it has its own environment that will not affect the parent shell's environment.

在一串指令的執行中，還需要藉由其他額外的指令所提供的資訊時，可以使用反單引號『`指令`』或 『$(指令)』。
```bash
$ s=123
$ echo "hello $( s=world; echo "$s" )"
hello world
$ echo "$s"
123
```

## Command redirection vs. Piping

:::info TL;DR
Pipe is used to pass output to another **program or utility**.
Redirect is used to pass output to either **a file or stream**.

- `ls > log.txt` sends the output to the log.txt file.

- `ls | grep file.txt` sends the output of the ls to grep command through the use of pipe (|), and the grep command searches for file.txt in the in the input provided to it by the previous command.

:::

**Piping** redirects the output of one program to the input of another program.

**Command substitution** changes the command you enter by replacing the part with the command substitution with the output of the program.

**Piping** only works if the other program reads input from `stdin` (standard input channel).

**Command substitution** only works if the other program allows being called with an argument that can be fulfilled by the command substitution output.

```bash
$ echo hello | cat
hello
```
works because `cat` reads from stdin by default so `cat` just displays what it reads from there...the output of `echo`

```bash
$ cat $(echo hello)
cat: hello: No such file or directory
```
Doesn't work because the result of command subsitution is `cat hello`...what cat interprets as a filename to use.

Or the other way around...lets asume we have a test.txt file...

```bash
$ echo test.txt | cat
test.txt
```
Well..kind of works but probably not what you wanted...it outputs what you gave with echo..

```bash
$ cat $(echo test.txt)
<outputs the content of the test.txt file>
```
I hope that makes it more clear now.

## References

- [Input Output Redirection in Linux/Unix Examples](https://www.guru99.com/linux-redirection.html)
- [第十章、認識與學習BASH](http://linux.vbird.org/linux_basic/0320bash.php#bash_why)
- [I/O Redirection](http://linuxcommand.org/lc3_lts0070.php)
- [Piping vs. command substitution--what's the difference?](https://www.reddit.com/r/linux4noobs/comments/9hz1pz/piping_vs_command_substitutionwhats_the_difference/)
