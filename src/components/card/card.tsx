import { forwardRef, ComponentProps } from "react";
import { Dispatch, SetStateAction } from "react";
import { transfer } from "../../infrastructure/pay";

export interface CustomWindow extends Window {
  ethereum?: any;
}

let customWindow: CustomWindow = window;

export interface CardProps
  extends Omit<ComponentProps<"div">, "className" | "children"> {
  title: string;
  description: string;
  amount: string;
  address: string;
  setWidgetState: Dispatch<
    SetStateAction<{ chatAddr: string; isOpen: boolean }>
  >;
}

const openFree = (address: string, setWidgetState: any) => {
  setWidgetState({
    chatAddr: address,
    isOpen: true,
  });
};

const openPay = async (
  amount: number,
  address: string,
  setWidgetState: any
) => {
  /* tslint:disable */
  if (!customWindow?.ethereum) {
    console.log("Not possible to pay yet");
  }

  const accounts = await customWindow?.ethereum.request({
    method: "eth_requestAccounts",
  });

  console.log({
    accounts,
    ethereum: customWindow?.ethereum,
    read: customWindow,
  });
  if (accounts[0]) {
    transfer(customWindow?.ethereum, amount, address)
      .then((txHash: string) => {
        console.log(txHash);
        setWidgetState({
          chatAddr: address,
          isOpen: true,
          provider: customWindow?.ethereum,
        });
      })
      .catch((error: any) => console.error(error));
  }
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ title, description, amount, address, setWidgetState, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className="bg-white bg-opacity-5 rounded-md shadow p-4 relative overflow-hidden h-18"
        {...rest}
        onClick={() => {
          if (isNaN(Number(amount))) {
            openFree(address, setWidgetState);
          } else {
            openPay(Number(amount), address, setWidgetState);
          }
        }}
      >
        <div className="flex flex-col h-full">
          <h3 className="text-2xl font-bold text-black text-blue-500">
            {title}
          </h3>
          <p className="mt-2 text-base text-gray-300 flex-1">{description}</p>
          <div className="p-2 absolute right-4 top-4 text-white">
            {isNaN(Number(amount)) ? "Free" : "$" + amount}
          </div>
        </div>
      </div>
    );
  }
);

export default Card;
