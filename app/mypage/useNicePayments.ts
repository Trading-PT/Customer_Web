import CryptoJS from "crypto-js";

const MID = process.env.NEXT_PUBLIC_NICEPAY_MID!;
const MERCHANT_KEY = process.env.NEXT_PUBLIC_NICEPAY_KEY!;

export const useNicepayPayment = () => {
  const openPayment = () => {
    // 필수 파라미터
    const ediDate = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14); // YYYYMMDDHHMMSS
    const amt = "260000"; // 테스트 금액
    const moid = "TPT_" + new Date().getTime();

    // SignData 생성
    const raw = ediDate + MID + amt + MERCHANT_KEY;
    const signData = CryptoJS.SHA256(raw).toString();

    // form 생성
    const form = document.createElement("form");
    form.method = "POST";
    form.target = "_self";
    form.action = "https://web.nicepay.co.kr/v3/pay.jsp"; // 테스트 URL

    // 필수 input
    const fields: Record<string, string> = {
      GoodsName: "TPT 정기구독",
      Amt: amt,
      MID,
      EdiDate: ediDate,
      Moid: moid,
      SignData: signData,
      PayMethod: "CARD",
      ReturnURL: "https://your-service.com/nicepay/return",
      BuyerName: "테스트유저",
      BuyerTel: "01012345678",
      CharSet: "utf-8",
      ConnWithIframe: "N",
    };

    for (const [key, value] of Object.entries(fields)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    document.body.appendChild(form);

    // NICEPAY 결제창 호출
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    goPay(form);
  };

  return { openPayment };
};