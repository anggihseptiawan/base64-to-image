import { createSignal, onMount } from "solid-js"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"

function App() {
  const [base64URL, setbase64URL] = createSignal("")
  const [base64URLResult, setbase64URLResult] = createSignal("")
  const [isCopied, setIsCopied] = createSignal(false)
  const [isHaveClipBoardSupport, setIsHaveClipBoardSupport] =
    createSignal(false)

  const onInputChange = (
    event: InputEvent & {
      currentTarget: HTMLTextAreaElement
      target: HTMLTextAreaElement
    }
  ) => {
    setbase64URL(event.target.value)
  }

  const onInputFileChange = (
    event: Event & {
      currentTarget: HTMLInputElement
      target: HTMLInputElement
    }
  ) => {
    if (!event.target.files) return

    const reader = new FileReader()
    reader.onloadend = (file) => {
      setbase64URLResult(String(file.target?.result))
    }
    reader.readAsDataURL(event.target.files[0])
  }

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(base64URLResult()).then(
      () => {
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 1000)
      },
      () => {
        console.log("ouch!")
      }
    )
  }

  onMount(() => {
    // @ts-ignore
    navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
      if (result.state === "granted" || result.state === "prompt") {
        setIsHaveClipBoardSupport(true)
      }
    })
  })

  return (
    <div class="container max-w-6xl mx-auto p-4">
      <div class="py-6">
        <h2 class="font-bold text-2xl">Base64 Decoder</h2>
        <p class="mb-4">It let's you convert your Base64 URL to an Image.</p>
        <div class="flex flex-col sm:flex-row gap-4">
          <textarea
            name="base64url"
            id="base64url"
            cols="30"
            rows="10"
            placeholder="Paste your base64 image URL"
            class="border-2 rounded-md p-4 border-gray-200 sm:w-1/2 focus-visible:outline-gray-300"
            onInput={(event) => onInputChange(event)}
          ></textarea>
          {base64URL() && (
            <div class="flex-1">
              <img
                src={base64URL()}
                class="rounded-md border border-gray-200"
                alt="image-preview"
              />
            </div>
          )}
        </div>
      </div>

      <div class="py-6">
        <h2 class="font-bold text-2xl">Base64 Encoder</h2>
        <p class="mb-4">Upload your image and convert it into Base64.</p>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="w-full sm:w-1/2">
            <Input
              type="file"
              onchange={(event) => onInputFileChange(event)}
              class="mb-2"
              accept=".jpg,.jpeg,.png,.svg,.webp"
            />
            {base64URLResult() && (
              <img
                src={base64URLResult()}
                class="rounded-md border border-gray-200"
                alt="image-preview"
              />
            )}
          </div>
          <div class="w-full sm:w-1/2">
            {isHaveClipBoardSupport() && base64URLResult() && (
              // @ts-ignore
              <Button class="mb-2" onClick={copyToClipBoard}>
                {isCopied() ? "Copied!" : "Copy to Clipboard"}
              </Button>
            )}
            <textarea
              name="base64URLResult"
              id="base64URLResult"
              cols="30"
              rows={10}
              class="border-2 rounded-md p-4 border-gray-200 w-full"
              style={{ height: "calc(100% - 47px)" }}
              value={base64URLResult()}
              placeholder="The result will be here"
              disabled
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
