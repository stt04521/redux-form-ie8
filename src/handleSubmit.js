import isPromise from 'is-promise'
import SubmissionError from './SubmissionError'

const handleSubmit = (submit, props, valid, asyncValidate, fields) => {
  const {
    dispatch, onSubmitFail, onSubmitSuccess, startSubmit, stopSubmit, setSubmitFailed,
    setSubmitSucceeded, syncErrors, touch, values
  } = props

  touch(...fields) // mark all fields as touched

  if (valid) {
    const doSubmit = () => {
      let result
      try {
        result = submit(values, dispatch)
      } catch (submitError) {
        const error = submitError instanceof SubmissionError ? submitError.errors : undefined
        setSubmitFailed(...fields)
        if (onSubmitFail) {
          onSubmitFail(error, dispatch)
        }
        return error
      }
      if (isPromise(result)) {
        startSubmit()
        return result
          .then(submitResult => {
            stopSubmit()
            setSubmitSucceeded()
            if (onSubmitSuccess) {
              onSubmitSuccess(submitResult, dispatch)
            }
            return submitResult
          }, submitError => {
            const error = submitError instanceof SubmissionError ? submitError.errors : undefined
            stopSubmit(error)
            setSubmitFailed(...fields)
            if (onSubmitFail) {
              onSubmitFail(error, dispatch)
            }
            return error
          })
      } else {
        setSubmitSucceeded()
        if (onSubmitSuccess) {
          onSubmitSuccess(result, dispatch)
        }
      }
      return result
    }

    const asyncValidateResult = asyncValidate && asyncValidate()
    if (asyncValidateResult) {
      return asyncValidateResult
        .then(
          doSubmit,
          asyncErrors => {
            setSubmitFailed(...fields)
            if (onSubmitFail) {
              onSubmitFail(asyncErrors, dispatch)
            }
            return Promise.reject(asyncErrors)
          })
    } else {
      return doSubmit()
    }
  } else {
    setSubmitFailed(...fields)
    if (onSubmitFail) {
      onSubmitFail(syncErrors, dispatch)
    }
    return syncErrors
  }
}

export default handleSubmit
