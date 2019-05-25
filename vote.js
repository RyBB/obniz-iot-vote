(() => {
  'use strict';

  const obniz = new Obniz('{YOUR_OBNIZ_ID}');

  const text = ['使う！！', '使いたい！', '使わない'];
  const postRecord = val => {
    const params = {
      app: kintone.app.getId(),
      record: {
        '{YOUR_KINTONE_FIELD_CODE}}': {
          value: val
        }
      }
    };
    return kintone.api(kintone.api.url('/k/v1/record', true), 'POST', params)
      .then(resp => resp.records)
      .catch(err => console.log(err));
  };

  kintone.events.on('app.record.index.show', (event) => {
    obniz.onconnect = async () => {
      obniz.display.clear();

      // ボタンの設定
      const buttons = [
        obniz.wired('Button',  {signal:0, gnd:1}),
        obniz.wired('Button',  {signal:2, gnd:3}),
        obniz.wired('Button',  {signal:4, gnd:5}),
      ];

      // ボタンにイベントを紐付ける
      buttons.forEach((val, index) => {
        val.onchange = async pressed => {
          if (!pressed) return;
          await postRecord(text[index]);
          obniz.display.print(text[index]);
          obniz.wait(1000);
          location.reload();
        };
      });
    };
    return event;
  });
})();
