
interface Action<T> {
  payload?: T;
  type: string;
}

class EffectModule {
  count = 1;
  message = "hello!";

  delay(input: Promise<number>) {
    return input.then(i => ({
      payload: `hello ${i}!`,
      type: 'delay'
    }));
  }

  setMessage(action: Action<Date>) {
    return {
      payload: action.payload!.getMilliseconds(),
      type: "set-message"
    };
  }
}

type FunName<T> = {
  [P in keyof T]: T[P] extends Function ? P : never
}[keyof T]

// 修改 Connect 的类型，让 connected 的类型变成预期的类型
type Connect = (module: EffectModule) => {
  [T in FunName<EffectModule>]: T extends 'delay'
    ? (input: number) => Action<string>
      : (action: Date) => Action<number>
};

const connect: Connect = m => ({
  delay: (input: number) => ({
    type: 'delay',
    payload: `hello 2`
  }),
  setMessage: (input: Date) => ({
    type: "set-message",
    payload: input.getMilliseconds()
  })
});

type Connected = {
  delay(input: number): Action<string>;
  setMessage(action: Date): Action<number>;
};

export const connected: Connected = connect(new EffectModule());
