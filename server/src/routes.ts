import { FastifyInstance } from 'fastify'
import { prisma } from './lib/prisma'
import { z } from 'zod'
import dayjs from 'dayjs'

export async function appRoutes(app: FastifyInstance) {

    app.post('/habits', async (request, resp) => {

        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
        })

        const { title, weekDays } = createHabitBody.parse(request.body)


        const today = dayjs().startOf('day').toDate()
        /* Zera a quantidade de horas do dia , e traz o formato padrão do JS q seria new Date() */

        await prisma.habit.create({
            data: {
                title,
                created_at: today,
                habitWeekDays: {
                    create: weekDays.map(weekDay => {
                        return {
                            week_day: weekDay
                        }
                    })
                }
            }
        })
        return resp.send({
            message: 'Hábito criado com sucesso!'
        })
    })

    app.get('/day', async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date() /* Coerce Converte a string em formato de data q vem do front em objeto Date do javascript */
        })

        const { date } = getDayParams.parse(request.query)

        const parsedDate = dayjs(date).startOf('day') /* Pega o dia de hoje e retorna com a informação zerada (inicio do dia) */

        const weekDay = parsedDate.get('day') /* retorna o dia da semana , semelhante ao newDate().getDay() */

        const possibleHabits = await prisma.habit.findMany({
            where: {
                created_at: {
                    lte: date, /* habitos que foram criados antes da data atual (data em que esse hábito está sendo criado) */
                },
                habitWeekDays: {
                    some: {
                        week_day: weekDay /* habitos disponíveis nesse dia específico da semana */
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate()
            },
            include: {
                dayHabits: true, /* Trazer as informações do hábito encontrado para esse determinado dia */
            }

        })

        const completedHabits = day?.dayHabits.map(dayHabit => {
            return dayHabit.habit_id
        }) ?? []
        /* Não preciso de todas as informações, apenas o IDs do hábito finalizado */



        return {
            possibleHabits,
            completedHabits
        }

    })

    app.patch('/habits/:id/toggle', async (request) => {

        const toogleHabitParam = z.object({
            id: z.string().uuid() /* validação se é um uuid */
        })

        const { id } = toogleHabitParam.parse(request.params)

        const today = dayjs().startOf('day').toDate()

        let day = await prisma.day.findUnique({
            where: {
                date: today
            }
        })

        /* Senão existir , crie o dia específico */
        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today
                }
            })
        }
        /* verifica se o hábito foi finalizado no dia específico (no caso hoje) */
        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id
                }
            }
        })


        if (dayHabit) {
            /* desmarcar */
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id
                }
            })
        }
        else {
            /* marcar */
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id
                }
            })
        }

    })

    app.get('/summary', async () => {
        //Query mais complexa, mais condições, relcionamentos => SQL na mão (RAW)
        // Prisma ORM: RAW SQL => SQLite

        const summary = await prisma.$queryRaw`
            SELECT
                D.id,
                D.date,
                (
                    SELECT
                        cast(count(*) as float)
                    FROM day_habits DH
                    WHERE DH.day_id = D.id 
                ) as completed,
                (
            SELECT
                cast(count(*) as float)
                FROM habit_week_days HDW
                JOIN habits H
                ON H.id = HDW.habit_id
            WHERE
                HDW.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
            AND H.created_at <= D.date
                ) as amount
            FROM days D 
        `
        /* query with 2 subquerys */
        /* Prisma não entende bigdata(retornado do count , então converte p float) */
        /* strftime é uma função do SQLite que pega o dia da semana daquela data específica(D.date) mas antes de pegar ,
            converte o Date para o formato unixepoch acrescentando 3 milisegundos (por isso a divisão)
            a função strftime returna uma string e portanto deve ser convertida para inteiro , para mostrar no Front
         */

        return summary
    })
}