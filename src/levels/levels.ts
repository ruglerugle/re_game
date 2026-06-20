export type Level = {
  id: number;
  title: string;
  description: string;
  match: string[];
  notMatch: string[];
  hint: string;
  solution: string;
  explanation: string;
};

export const levels: Level[] = [
  {
    id: 1,
    title: "リテラル一致",
    description: "「cat」という文字列を含むものだけにマッチさせてください。",
    match: ["cat", "concatenate", "scatter"],
    notMatch: ["dog", "Cat", "ct", "caat"],
    hint: "特別な記号は不要です。そのままの文字を並べるだけでマッチします。",
    solution: "cat",
    explanation: "正規表現に特殊文字を含めなければ、その文字列をそのまま検索します。大文字小文字は区別されるため「Cat」にはマッチしません。",
  },
  {
    id: 2,
    title: "文字クラス",
    description: "文字列全体が「gray」または「grey」のどちらかと完全に一致する場合だけマッチさせてください。",
    match: ["gray", "grey"],
    notMatch: ["graey", "gry", "graay", "111grey222", "agray"],
    hint: "2つの選択肢のどちらかにマッチさせるには「|」（OR）か文字クラス「[ ]」が使えます。さらに文字列全体を縛るアンカーも必要です。",
    solution: "^gr(a|e)y$",
    explanation: "`(a|e)` は「aまたはe」を意味するグループです。文字クラス `gr[ae]y` でも同じ結果になります。アンカー `^` `$` がないと「111grey222」のように前後に余計な文字がある文字列にも部分一致してしまいます。",
  },
  {
    id: 3,
    title: "数字にマッチ",
    description: "1個以上の数字だけで構成される文字列にマッチさせてください。",
    match: ["123", "0", "9999"],
    notMatch: ["12a", "abc", "", "1.5"],
    hint: "数字1文字を表すクラスと、繰り返しを表す量指定子、そして文字列全体を縛るアンカーが必要です。",
    solution: "^[0-9]+$",
    explanation: "`[0-9]` は数字1文字、`+` は1回以上の繰り返し、`^`と`$` は文字列の先頭と末尾を表します。アンカーがないと「12a」の一部にもマッチしてしまいます。",
  },
  {
    id: 4,
    title: "量指定子",
    description: "「a」が2〜4回連続する文字列にマッチさせてください。",
    match: ["aa", "aaa", "aaaa"],
    notMatch: ["a", "aaaaa", "ab", ""],
    hint: "回数の範囲を指定する量指定子 `{min,max}` を使い、文字列全体をアンカーで固定しましょう。",
    solution: "^a{2,4}$",
    explanation: "`{2,4}` は直前の文字（ここでは a）が2回から4回連続することを表します。アンカーがないと「aaaaa」の中の4文字分にマッチしてしまうため注意が必要です。",
  },
  {
    id: 5,
    title: "アンカー（先頭）",
    description: "「http://」または「https://」で始まる文字列にマッチさせてください。",
    match: ["http://example.com", "https://example.com"],
    notMatch: ["ftp://example.com", "xhttp://example.com", "example.com"],
    hint: "文字列の先頭であることを示すアンカーと、「s」があってもなくても良いことを示す量指定子を組み合わせます。",
    solution: "^https?://",
    explanation: "`^` は先頭固定、`s?` は「sが0回か1回」を意味します。`^` がないと「xhttp://」のように途中にhttp://を含む文字列にも誤ってマッチします。",
  },
  {
    id: 6,
    title: "アンカー（完全一致）",
    description: "文字列全体が3桁の数字のみであるものにマッチさせてください。",
    match: ["123", "000", "999"],
    notMatch: ["1234", "12", "12a", "a123"],
    hint: "先頭と末尾の両方をアンカーで固定し、回数指定 `{n}` を使いましょう。",
    solution: "^[0-9]{3}$",
    explanation: "`^` と `$` で文字列全体を固定し、`{3}` で「ちょうど3回」を指定します。両方のアンカーがないと「1234」や「a123」の部分文字列にもマッチしてしまいます。",
  },
  {
    id: 7,
    title: "メールアドレス（簡易）",
    description: "文字列全体が「ユーザー名@ドメイン.トップレベル」形式の簡易メールアドレスである場合だけマッチさせてください。",
    match: ["a@b.com", "user.name@example.co.jp"],
    notMatch: ["a@b", "@b.com", "a@.com", "plain text"],
    hint: "「@より前」「@とドット以外の文字列」「ドット」「残りの文字列」を否定文字クラスでつなげます。",
    solution: "^[^@]+@[^@.]+\\.[^@]+$",
    explanation: "`[^@]+` は「@以外の文字が1つ以上」、`[^@.]+` は「@とドット以外の文字が1つ以上」を意味し、ドメイン部分が空にならないようにしています。ドットはエスケープ `\\.` が必要です。",
  },
  {
    id: 8,
    title: "否定文字クラス",
    description: "数字を1文字も含まない文字列にマッチさせてください。",
    match: ["hello", "abc-def", ""],
    notMatch: ["abc1", "123", "a2b"],
    hint: "文字クラスの先頭に `^` を置くと「それ以外」を意味する否定文字クラスになります。",
    solution: "^[^0-9]*$",
    explanation: "文字クラス内の `^`（`[^0-9]`）は「0-9以外の1文字」を意味します（アンカーの `^` とは役割が違うので注意）。`*` は0回以上なので空文字にもマッチします。",
  },
  {
    id: 9,
    title: "グループと選択",
    description: "「red」「green」「blue」のいずれかの色名だけにマッチさせてください。",
    match: ["red", "green", "blue"],
    notMatch: ["redish", "darkblue", "yellow", "Red"],
    hint: "`|` で複数の単語を選択肢にし、グループ `( )` でまとめてアンカーで固定します。",
    solution: "^(red|green|blue)$",
    explanation: "`(red|green|blue)` は3つの単語のいずれかを意味するグループです。アンカーがないと「redish」や「darkblue」の一部にもマッチしてしまいます。",
  },
  {
    id: 10,
    title: "先読み（応用）",
    description: "8文字以上で、かつ数字を少なくとも1つ含む文字列にマッチさせてください。",
    match: ["password1", "abcdefg9", "12345678"],
    notMatch: ["password", "short1", "abcdefgh"],
    hint: "「8文字以上」と「数字を含む」という2つの独立した条件を同時にチェックするには、先読み `(?=...)` を使います。",
    solution: "^(?=.{8,}$).*[0-9]",
    explanation: "`(?=.{8,}$)` は「この位置から8文字以上ある」ことを確認する先読みで、文字を消費しません。続く `.*[0-9]` で「数字を含む」ことを別途チェックしています。2つの条件を順番に書くだけでは片方しか保証できないため、先読みで分離します。",
  },
];
