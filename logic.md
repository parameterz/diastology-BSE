Eval initialQuestion
    if positive
        Impaired diastolic function (end)
    if negative
        eval age-specific e'
    else if only 2 criteria available, 1 positive & 1 negative
        eval LA strain

Eval Age specific e'
    if positive
        Impaired diastolic function with normal filling (end)
    if negative
        Normal diastolic function (end)

Eval LA strain
    if positive
        eval LARS
    if negative
        eval Age specific e'

Eval LARS
    if positive
        Impaired diastolic function (end)
    if negative
        eval supplementary parameters

Eval supplementary parameters
    if positive
        Impaired diastolic function (end)
    if negative
        eval Age specific e'