import { createSignal } from "solid-js"

function App() {
  const [base64URL, setbase64URL] = createSignal("")
  const [base64URLResult, setbase64URLResult] = createSignal("")

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

  return (
    <div class="container max-w-6xl mx-auto p-4">
      <div class="py-6">
        <h2 class="font-bold text-2xl mb-4">Base64 Image Previewer</h2>
        <div class="flex flex-col sm:flex-row gap-4">
          <textarea
            name="base64url"
            id="base64url"
            cols="30"
            rows="10"
            placeholder="Paste your base64 image URL"
            class="border-2 rounded-md p-4 border-blue-500 sm:w-1/2"
            onInput={(event) => onInputChange(event)}
          ></textarea>
          {base64URL() && (
            <div class="flex-1">
              <img src={base64URL()} alt="image-preview" />
            </div>
          )}
        </div>
      </div>

      <div class="py-6">
        <h2 class="font-bold text-2xl mb-4">Convert image to base64 URL</h2>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="w-full sm:w-1/2">
            <input
              type="file"
              onchange={(event) => onInputFileChange(event)}
              class="mb-2"
              accept=".jpg,.jpeg,.png,.svg,.webp"
            />
            {base64URLResult() && (
              <img src={base64URLResult()} alt="image-preview" />
            )}
          </div>
          <div class="w-full sm:w-1/2">
            <textarea
              name="base64URLResult"
              id="base64URLResult"
              cols="30"
              rows="10"
              class="border-2 rounded-md p-4 border-blue-500 w-full"
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
