import { useState } from 'react'

export default function CardComponent() {
    const [cardNumber, setCardNumber] = useState('')
    const checkInput = (e) => {
        var input = e.target.value;
        if (e.nativeEvent.inputType === 'deleteContentBackward') {
            setCardNumber(input)
        } else {
            var lastCharacter = input[input.length - 1]
            if ((parseInt(lastCharacter) >= 0 && parseInt(lastCharacter) <= 9) || (typeof (lastCharacter) === 'undefined') || lastCharacter === '-') {
                var inputSubArray = input.split('-')
                console.log(inputSubArray)
                if (inputSubArray[inputSubArray.length - 1].length % 4 === 0 && input.length < 19) {
                    input = inputSubArray.join('-')
                    input += '-'
                }
                setCardNumber(input)

            }
        }
    }
    return (
        <div className='cardComponent'>
            <div className='cardComponentInput'>
                <label htmlFor='cardNumber'>Card Number</label>
                <input id='cardNumber' type="text" value={cardNumber} placeholder='XXXX-XXXX-XXXX-XXXX' maxLength='19' onChange={checkInput} />
            </div>
            <div className='cardComponentInput'>
                <label htmlFor='cardHolder'>Card Number</label>
                <input type='text' id='cardNHolder' placeholder='Name' />
            </div>
            <div className='cardComponentNumber'>
                <input type='number' placeholder='CVV' />
                <span>whats's this ?</span>
            </div>
            <div>
                <input />
            </div>
        </div>
    )
}

